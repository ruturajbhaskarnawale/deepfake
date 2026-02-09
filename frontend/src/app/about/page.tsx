"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                About The Project
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                A comprehensive deepfake detection system using state-of-the-art deep learning.
            </p>
        </div>

        <div className="grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-slate-600 dark:text-slate-300">
                    <p>
                        This project implements and compares four advanced deepfake detection models: EfficientNet-B4, Xception, Hybrid Forensic, and CLIP.
                        Our goal is to provide a reliable tool for identifying manipulated facial images and videos in an era of increasing digital misinformation.
                    </p>
                    <p>
                        The system uses a combination of transfer learning and forensic analysis (RGB + SRM) to detect subtle artifacts left by generative adversarial networks (GANs) and other manipulation techniques.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                        <li><strong>Multi-Model Support</strong>: Choose between speed and accuracy with different architectures.</li>
                        <li><strong>Forensic Analysis</strong>: Detects frequency domain anomalies invisible to the human eye.</li>
                        <li><strong>User-Friendly Interface</strong>: Simple drag-and-drop workflow for instant analysis.</li>
                        <li><strong>Detailed Reporting</strong>: View confidence scores and probability metrics.</li>
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Future Roadmap</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                        <li>Video temporal analysis for frame-by-frame consistency.</li>
                        <li>Audio deepfake detection integration.</li>
                        <li>Explainable AI (XAI) features like Grad-CAM heatmaps.</li>
                        <li>Public API for developers.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
