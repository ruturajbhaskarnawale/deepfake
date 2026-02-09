import matplotlib.pyplot as plt
import pandas as pd
import os

def plot_training_results():
    log_path = r'C:\deepfake\logs\training_log.txt'
    
    if not os.path.exists(log_path):
        print(f"File not found: {log_path}")
        return

    print(f"Reading logs from: {log_path}")
    
    # Read the CSV
    try:
        df = pd.read_csv(log_path)
    except Exception as e:
        print(f"Failed to read log file: {e}")
        return

    # The log file contains multiple runs appended sequentially.
    # We need to distinguish them. We assume a new model starts whenever Epoch resets to 1.
    
    # Create a differentiation column 'Run_ID'
    # The condition (df['Epoch'] == 1) is True at the start of each run.
    # cumsum() propagates the count, effectively giving us an ID for each run.
    df['Run_ID'] = (df['Epoch'] == 1).cumsum()
    
    num_runs = df['Run_ID'].nunique()
    print(f"Found {num_runs} training runs in the log file.")

    # Assumed model names based on expected execution order
    # If there are more runs than names, we'll label them generically.
    known_models = ['EfficientNet-B4', 'Xception', 'Hybrid Forensic', 'CLIP']
    
    # Setup the plot
    metrics = ['Loss', 'Accuracy', 'Precision', 'Recall', 'F1_Score']
    plt.figure(figsize=(18, 12))
    
    # We have 5 metrics, let's do a 2x3 grid
    
    for i, metric in enumerate(metrics):
        plt.subplot(2, 3, i+1)
        
        for run_id in range(1, num_runs + 1):
            run_data = df[df['Run_ID'] == run_id]
            
            # Label Assignment
            idx = run_id - 1
            if idx < len(known_models):
                label = known_models[idx]
            else:
                label = f"Model {run_id}"
            
            plt.plot(run_data['Epoch'], run_data[metric], marker='o', markersize=4, label=label)
            
        plt.title(f'Training {metric} per Epoch')
        plt.xlabel('Epoch')
        plt.ylabel(metric)
        plt.grid(True, linestyle='--', alpha=0.7)
        plt.legend()
        
    plt.tight_layout()
    output_filename = 'training_metrics_comparison.png'
    plt.savefig(output_filename, dpi=300)
    print(f"Comparison plots saved to {output_filename}")

def plot_best_model_comparison():
    """
    Create a bar chart comparing the best (final epoch) performance of each model
    """
    log_path = r'C:\deepfake\logs\training_log.txt'
    
    if not os.path.exists(log_path):
        print(f"File not found: {log_path}")
        return

    print(f"Reading logs from: {log_path}")
    
    # Read the CSV
    try:
        df = pd.read_csv(log_path)
    except Exception as e:
        print(f"Failed to read log file: {e}")
        return

    # Create Run_ID to distinguish different model runs
    df['Run_ID'] = (df['Epoch'] == 1).cumsum()
    
    num_runs = df['Run_ID'].nunique()
    known_models = ['EfficientNet-B4', 'Xception', 'Hybrid Forensic', 'CLIP']
    
    # Extract the final epoch metrics for each run
    best_metrics = []
    
    for run_id in range(1, num_runs + 1):
        run_data = df[df['Run_ID'] == run_id]
        
        # Get the last epoch (best performance)
        final_epoch = run_data.iloc[-1]
        
        # Label Assignment
        idx = run_id - 1
        if idx < len(known_models):
            model_name = known_models[idx]
        else:
            model_name = f"Model {run_id}"
        
        best_metrics.append({
            'Model': model_name,
            'Loss': final_epoch['Loss'],
            'Accuracy': final_epoch['Accuracy'],
            'Precision': final_epoch['Precision'],
            'Recall': final_epoch['Recall'],
            'F1_Score': final_epoch['F1_Score']
        })
    
    best_df = pd.DataFrame(best_metrics)
    
    # Create the comparison plot
    fig, axes = plt.subplots(2, 3, figsize=(18, 10))
    fig.suptitle('Best Model Comparison (Final Epoch Metrics)', fontsize=16, fontweight='bold')
    
    metrics = ['Loss', 'Accuracy', 'Precision', 'Recall', 'F1_Score']
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
    
    for i, metric in enumerate(metrics):
        row = i // 3
        col = i % 3
        ax = axes[row, col]
        
        bars = ax.bar(best_df['Model'], best_df[metric], color=colors[i], alpha=0.8, edgecolor='black')
        
        # Add value labels on top of bars
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{height:.4f}',
                   ha='center', va='bottom', fontsize=9, fontweight='bold')
        
        ax.set_title(f'{metric}', fontsize=12, fontweight='bold')
        ax.set_ylabel(metric, fontsize=10)
        ax.set_xlabel('Model', fontsize=10)
        ax.grid(True, axis='y', linestyle='--', alpha=0.3)
        ax.tick_params(axis='x', rotation=15)
        
        # Adjust y-axis limits for better visualization
        if metric == 'Loss':
            ax.set_ylim(0, max(best_df[metric]) * 1.2)
        else:
            ax.set_ylim(0, 1.1)
    
    # Remove the extra subplot (2x3 grid has 6 slots, we only use 5)
    fig.delaxes(axes[1, 2])
    
    plt.tight_layout()
    output_filename = 'best_model_comparison.png'
    plt.savefig(output_filename, dpi=300, bbox_inches='tight')
    print(f"Best model comparison plot saved to {output_filename}")
    
    # Print summary table
    print("\n" + "="*70)
    print("BEST MODEL PERFORMANCE SUMMARY (Final Epoch)")
    print("="*70)
    print(best_df.to_string(index=False))
    print("="*70)

if __name__ == "__main__":
    plot_training_results()
    print("\n")
    plot_best_model_comparison()
