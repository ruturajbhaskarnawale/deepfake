import torch
import torch.nn as nn
import timm
from transformers import CLIPModel, CLIPProcessor, AutoModel
import torchvision.models as models

class DeepfakeDetector(nn.Module):
    def __init__(self, model_name, num_classes=1, device='cpu'):
        super(DeepfakeDetector, self).__init__()
        self.model_name = model_name
        self.device = device
        
        if model_name == 'efficientnet_b4':
            self.backbone = timm.create_model('efficientnet_b4', pretrained=True, num_classes=num_classes)
            
        elif model_name == 'xception':
            self.backbone = timm.create_model('xception', pretrained=True, num_classes=num_classes)
            
        elif model_name == 'clip':
            # CLIP usually requires complex input, here we use just visual encoder or both?
            # For classification, we assume finetuning visual encoder -> Linear
            self.backbone = CLIPModel.from_pretrained("openai/clip-vit-large-patch14")
            for param in self.backbone.parameters():
                param.requires_grad = False # Freeze by default
            
            # Adaptation layer
            self.fc = nn.Linear(768, num_classes) # Large has 768 dim
            
        elif model_name == 'hybrid_forensic':
            # ResNet (RGB) + ResNet (SRM)
            self.rgb_net = models.resnet18(pretrained=True)
            self.rgb_net.fc = nn.Identity() # Remove head
            
            self.srm_net = models.resnet18(pretrained=False) # Train from scratch on SRM
            self.srm_net.fc = nn.Identity()
            
            # Fusion
            self.fc = nn.Linear(512 + 512, num_classes)
            
        # Add basic Sigmoid for BCE if needed, but BCEWithLogitsLoss is preferred in training loop
        
    def forward(self, x_rgb, x_srm=None, x_audio=None):
        if self.model_name in ['efficientnet_b4', 'xception']:
            return self.backbone(x_rgb)
            
        elif self.model_name == 'clip':
            # Assuming x_rgb is preprocessed CLIP pixel values found in batch
            # Actually CLIP expects specific transform. 
            # Trainer needs to handle transform. Here we assume x_rgb is valid tensor.
            # We use get_image_features
            # CLIP requires 224x224
            if x_rgb.shape[-1] != 224 or x_rgb.shape[-2] != 224:
                x_rgb = nn.functional.interpolate(x_rgb, size=(224, 224), mode='bicubic', align_corners=False)
            
            # Manual forward pass to ensure we get the tensor
            # features = self.backbone.get_image_features(pixel_values=x_rgb)
            vision_outputs = self.backbone.vision_model(pixel_values=x_rgb)
            pooled_output = vision_outputs.pooler_output # (B, 1024) for Large
            features = self.backbone.visual_projection(pooled_output) # (B, 768)
            
            return self.fc(features)
            
        elif self.model_name == 'hybrid_forensic':
            if x_srm is None:
                raise ValueError("SRM input required for hybrid model")
            emb_rgb = self.rgb_net(x_rgb)
            emb_srm = self.srm_net(x_srm)
            combined = torch.cat((emb_rgb, emb_srm), dim=1)
            return self.fc(combined)
            
        return None

def create_model(config):
    return DeepfakeDetector(config['model_name'], device=config.get('device', 'cpu'))
