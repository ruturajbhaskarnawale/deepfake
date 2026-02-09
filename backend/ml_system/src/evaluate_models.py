import argparse
import os
import torch
import pandas as pd
import numpy as np
from tqdm import tqdm
from models_factory import create_model
from test_utils import (
    load_validation_data, 
    calculate_metrics, 
    plot_all_confusion_matrices,
    plot_roc_curves
)


def evaluate_single_model(model_name, checkpoint_path, val_data, device):
    """
    Evaluate a single model on validation data
    
    Returns:
        dict with y_true, y_pred, y_prob, predictions_list
    """
    print(f"\n{'='*60}")
    print(f"Evaluating: {model_name}")
    print(f"Checkpoint: {checkpoint_path}")
    print(f"{'='*60}")
    
    # Load model
    config = {'model_name': model_name, 'device': device}
    model = create_model(config)
    
    if not os.path.exists(checkpoint_path):
        print(f"ERROR: Checkpoint not found at {checkpoint_path}")
        return None
    
    model.load_state_dict(torch.load(checkpoint_path, map_location=device, weights_only=True))
    model.to(device)
    model.eval()
    
    y_true = []
    y_pred = []
    y_prob = []
    predictions_list = []
    
    # Run inference
    with torch.no_grad():
        for sample in tqdm(val_data, desc=f"Testing {model_name}"):
            rgb = sample['rgb'].to(device)
            srm = sample['srm'].to(device)
            label = sample['label']
            
            # Forward pass
            if model_name == 'hybrid_forensic':
                output = model(rgb, x_srm=srm)
            else:
                output = model(rgb)
            
            # Get probability
            prob = torch.sigmoid(output).item()
            pred = 1 if prob > 0.5 else 0
            
            y_true.append(int(label))
            y_pred.append(pred)
            y_prob.append(prob)
            
            predictions_list.append({
                'path': sample['path'],
                'true_label': 'Fake' if label == 1 else 'Real',
                'predicted_label': 'Fake' if pred == 1 else 'Real',
                'probability': prob,
                'correct': pred == int(label)
            })
    
    return {
        'y_true': y_true,
        'y_pred': y_pred,
        'y_prob': y_prob,
        'predictions': predictions_list
    }


def generate_markdown_report(results_dict, metrics_dict, output_path):
    """
    Generate a comprehensive markdown report
    """
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Deepfake Detection Model Evaluation Report\n\n")
        f.write("## Overview\n\n")
        f.write("This report contains the evaluation results of all trained deepfake detection models on the validation set.\n\n")
        
        # Metrics table
        f.write("## Performance Metrics\n\n")
        f.write("| Model | Accuracy | Precision | Recall | F1 Score | AUC-ROC |\n")
        f.write("|-------|----------|-----------|--------|----------|----------|\n")
        
        for model_name, metrics in metrics_dict.items():
            f.write(f"| {model_name} | {metrics['accuracy']:.4f} | {metrics['precision']:.4f} | "
                   f"{metrics['recall']:.4f} | {metrics['f1_score']:.4f} | {metrics['auc_roc']:.4f} |\n")
        
        f.write("\n")
        
        # Best model
        best_model = max(metrics_dict.items(), key=lambda x: x[1]['f1_score'])
        f.write("## Best Model\n\n")
        f.write(f"**{best_model[0]}** achieved the highest F1 Score of **{best_model[1]['f1_score']:.4f}**\n\n")
        
        # Detailed results
        f.write("## Detailed Results\n\n")
        for model_name, data in results_dict.items():
            f.write(f"### {model_name}\n\n")
            
            # Confusion matrix values
            from sklearn.metrics import confusion_matrix
            cm = confusion_matrix(data['y_true'], data['y_pred'])
            tn, fp, fn, tp = cm.ravel()
            
            f.write(f"- **True Negatives (Real → Real)**: {tn}\n")
            f.write(f"- **False Positives (Real → Fake)**: {fp}\n")
            f.write(f"- **False Negatives (Fake → Real)**: {fn}\n")
            f.write(f"- **True Positives (Fake → Fake)**: {tp}\n\n")
        
        # Visualizations
        f.write("## Visualizations\n\n")
        f.write("### Confusion Matrices\n\n")
        f.write("![Confusion Matrices](../results/confusion_matrices.png)\n\n")
        f.write("### ROC Curves\n\n")
        f.write("![ROC Curves](../results/roc_curves.png)\n\n")
        
        f.write("---\n\n")
        f.write("*Report generated automatically by evaluate_models.py*\n")


def main(args):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}\n")
    
    # Load validation data
    val_list_path = r'C:\deepfake\data\val_list.txt'
    print(f"Loading validation data from: {val_list_path}")
    val_data = load_validation_data(val_list_path)
    print(f"Loaded {len(val_data)} validation samples\n")
    
    # Define models and checkpoints
    models_to_test = {
        'EfficientNet-B4': {
            'model_name': 'efficientnet_b4',
            'checkpoint': r'C:\deepfake\models\checkpoints\efficientnet_b4_ep5.pth'
        },
        'Xception': {
            'model_name': 'xception',
            'checkpoint': r'C:\deepfake\models\checkpoints\xception_ep5.pth'
        },
        'Hybrid Forensic': {
            'model_name': 'hybrid_forensic',
            'checkpoint': r'C:\deepfake\models\checkpoints\hybrid_forensic_ep5.pth'
        },
        'CLIP': {
            'model_name': 'clip',
            'checkpoint': r'C:\deepfake\models\checkpoints\clip_ep5.pth'
        }
    }
    
    # Evaluate all models
    results_dict = {}
    metrics_dict = {}
    all_predictions = []
    
    for display_name, config in models_to_test.items():
        result = evaluate_single_model(
            config['model_name'], 
            config['checkpoint'], 
            val_data, 
            device
        )
        
        if result is None:
            continue
        
        # Calculate metrics
        metrics = calculate_metrics(result['y_true'], result['y_pred'], result['y_prob'])
        
        # Store results
        results_dict[display_name] = result
        metrics_dict[display_name] = metrics
        
        # Add model name to predictions
        for pred in result['predictions']:
            pred['model'] = display_name
            all_predictions.append(pred)
        
        # Print metrics
        print(f"\nMetrics for {display_name}:")
        for metric_name, value in metrics.items():
            print(f"  {metric_name.capitalize()}: {value:.4f}")
    
    # Create output directory
    output_dir = r'C:\deepfake\results'
    os.makedirs(output_dir, exist_ok=True)
    
    # Save predictions to CSV
    predictions_df = pd.DataFrame(all_predictions)
    predictions_csv_path = os.path.join(output_dir, 'predictions.csv')
    predictions_df.to_csv(predictions_csv_path, index=False)
    print(f"\nPredictions saved to: {predictions_csv_path}")
    
    # Generate visualizations
    print("\nGenerating visualizations...")
    
    cm_path = os.path.join(output_dir, 'confusion_matrices.png')
    plot_all_confusion_matrices(results_dict, cm_path)
    print(f"Confusion matrices saved to: {cm_path}")
    
    roc_path = os.path.join(output_dir, 'roc_curves.png')
    plot_roc_curves(results_dict, roc_path)
    print(f"ROC curves saved to: {roc_path}")
    
    # Generate report
    report_path = os.path.join(output_dir, 'evaluation_report.md')
    generate_markdown_report(results_dict, metrics_dict, report_path)
    print(f"\nEvaluation report saved to: {report_path}")
    
    print("\n" + "="*60)
    print("EVALUATION COMPLETE!")
    print("="*60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Evaluate all deepfake detection models')
    parser.add_argument('--output', type=str, default=r'C:\deepfake\results', 
                       help='Output directory for results')
    args = parser.parse_args()
    
    main(args)
