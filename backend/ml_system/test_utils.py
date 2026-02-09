import numpy as np
import torch
import cv2
import os
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix, roc_curve
import matplotlib.pyplot as plt
import seaborn as sns
from preprocess import apply_srm_filter


def load_validation_data(val_list_path):
    """
    Load validation data from val_list.txt
    
    Returns:
        list of dicts with keys: 'rgb', 'srm', 'label', 'path'
    """
    with open(val_list_path, 'r') as f:
        record_paths = [line.strip() for line in f.readlines() if line.strip()]
    
    val_data = []
    
    for path in record_paths:
        try:
            # Load face and SRM
            face = np.load(os.path.join(path, 'face.npy'))
            srm = np.load(os.path.join(path, 'srm.npy'))
            
            # Extract label from path
            if 'fake' in path.lower().replace(os.sep, '/').split('/'):
                label = 1.0
            else:
                label = 0.0
            
            # Convert to tensors
            face_t = torch.tensor(face).permute(2, 0, 1).float() / 255.0
            srm_t = torch.tensor(srm).permute(2, 0, 1).float()
            
            val_data.append({
                'rgb': face_t.unsqueeze(0),  # Add batch dim
                'srm': srm_t.unsqueeze(0),
                'label': label,
                'path': path
            })
        except Exception as e:
            print(f"Warning: Failed to load {path}: {e}")
            continue
    
    return val_data


def calculate_metrics(y_true, y_pred, y_prob):
    """
    Calculate comprehensive metrics
    
    Args:
        y_true: Ground truth labels (0 or 1)
        y_pred: Predicted labels (0 or 1)
        y_prob: Predicted probabilities (0.0 to 1.0)
    
    Returns:
        dict with metrics
    """
    metrics = {
        'accuracy': accuracy_score(y_true, y_pred),
        'precision': precision_score(y_true, y_pred, zero_division=0),
        'recall': recall_score(y_true, y_pred, zero_division=0),
        'f1_score': f1_score(y_true, y_pred, zero_division=0),
    }
    
    # AUC only if we have both classes
    if len(np.unique(y_true)) > 1:
        metrics['auc_roc'] = roc_auc_score(y_true, y_prob)
    else:
        metrics['auc_roc'] = 0.0
    
    return metrics


def plot_confusion_matrix(y_true, y_pred, model_name, save_path):
    """
    Plot and save confusion matrix
    """
    cm = confusion_matrix(y_true, y_pred)
    
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=['Real', 'Fake'], 
                yticklabels=['Real', 'Fake'])
    plt.title(f'Confusion Matrix - {model_name}')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()


def plot_roc_curves(results_dict, save_path):
    """
    Plot ROC curves for all models
    
    Args:
        results_dict: dict with model_name -> {'y_true': [], 'y_prob': []}
    """
    plt.figure(figsize=(10, 8))
    
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
    
    for i, (model_name, data) in enumerate(results_dict.items()):
        y_true = data['y_true']
        y_prob = data['y_prob']
        
        if len(np.unique(y_true)) > 1:
            fpr, tpr, _ = roc_curve(y_true, y_prob)
            auc = roc_auc_score(y_true, y_prob)
            plt.plot(fpr, tpr, label=f'{model_name} (AUC = {auc:.3f})', 
                    color=colors[i % len(colors)], linewidth=2)
    
    plt.plot([0, 1], [0, 1], 'k--', label='Random Classifier', linewidth=1)
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate', fontsize=12)
    plt.ylabel('True Positive Rate', fontsize=12)
    plt.title('ROC Curves - Model Comparison', fontsize=14, fontweight='bold')
    plt.legend(loc='lower right', fontsize=10)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()


def plot_all_confusion_matrices(results_dict, save_path):
    """
    Plot confusion matrices for all models in a grid
    """
    num_models = len(results_dict)
    fig, axes = plt.subplots(2, 2, figsize=(14, 12))
    fig.suptitle('Confusion Matrices - All Models', fontsize=16, fontweight='bold')
    
    axes = axes.flatten()
    
    for i, (model_name, data) in enumerate(results_dict.items()):
        cm = confusion_matrix(data['y_true'], data['y_pred'])
        
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                   xticklabels=['Real', 'Fake'], 
                   yticklabels=['Real', 'Fake'],
                   ax=axes[i], cbar=True)
        axes[i].set_title(model_name, fontsize=12, fontweight='bold')
        axes[i].set_ylabel('True Label')
        axes[i].set_xlabel('Predicted Label')
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()
