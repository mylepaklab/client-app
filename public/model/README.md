# Teachable Machine Model Files

Place your exported Teachable Machine model files here:

1. **model.json** - The model architecture and configuration
2. **metadata.json** - Contains class labels and other metadata
3. **weights.bin** - The trained model weights

## How to export from Teachable Machine:

1. Go to [Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Create and train your image model
3. Click "Export Model"
4. Choose "TensorFlow.js" format
5. Download the files and place them in this directory

## File structure should look like:

```
public/model/
├── model.json
├── metadata.json
├── weights.bin
└── README.md (this file)
```

The model will be automatically loaded when you visit the test connection page.
