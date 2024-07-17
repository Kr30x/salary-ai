from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import joblib

app = Flask(__name__)

# Load the trained model
model = load_model('salary_prediction_model.h5')

# Load the tokenizer
tokenizer = joblib.load('tokenizer.joblib')

# Load the scaler
scaler = joblib.load('scaler.joblib')

# Constants (make sure these match your training setup)
max_words = 10000
max_len = 200

def preprocess_text(text):
    if pd.isna(text):
        return ""
    return str(text).lower()

@app.route('/predict', methods=['POST'])
def predict_salary():
    data = request.json
    job_description = data['description']
    
    # Preprocess the input
    processed_text = preprocess_text(job_description)
    sequence = tokenizer.texts_to_sequences([processed_text])
    padded = pad_sequences(sequence, maxlen=max_len)
    
    # Make prediction
    prediction = model.predict(padded)
    log_salary = scaler.inverse_transform(prediction)[0][0]
    salary = np.expm1(log_salary)
    
    return jsonify({'predicted_max_salary': float(salary)})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)