import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, GlobalAveragePooling1D, Dense
import tensorflow as tf
import joblib

print('imported all modules')

df = pd.read_csv('postings.csv')

print("loaded dataframe")

def preprocess_text(text):
    if pd.isna(text):
        return ""
    return str(text).lower()

df['description'] = df['description'].apply(preprocess_text)
df = df.dropna(subset=['max_salary', 'description'])
df = df[df['max_salary'] > 0]

df['log_salary'] = np.log1p(df['max_salary'])


max_words = 10000
max_len = 200
tokenizer = Tokenizer(num_words=max_words, oov_token='<OOV>')
tokenizer.fit_on_texts(df['description'])
X = tokenizer.texts_to_sequences(df['description'])
X = pad_sequences(X, maxlen=max_len)
y = df['log_salary'].values

print("preprocessed dataframe")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=69)

scaler = StandardScaler()
y_train_scaled = scaler.fit_transform(y_train.reshape(-1, 1)).flatten()
y_test_scaled = scaler.transform(y_test.reshape(-1, 1)).flatten()

model = Sequential([
    Embedding(max_words, 50, input_length=max_len),
    GlobalAveragePooling1D(),
    Dense(16, activation='relu'),
    Dense(1)
])

optimizer = tf.keras.optimizers.Adam(learning_rate=0.0001)
model.compile(optimizer=optimizer, loss='mse', metrics=['mae'])

history = model.fit(
    X_train, y_train_scaled,
    epochs=100,
    batch_size=32,
    validation_split=0.2,
    verbose=1
)

loss, mae = model.evaluate(X_test, y_test_scaled, verbose=0)
print(f"\nTest MAE: {mae}")

def predict_salary(job_description):
    processed_text = preprocess_text(job_description)
    sequence = tokenizer.texts_to_sequences([processed_text])
    padded = pad_sequences(sequence, maxlen=max_len)
    prediction = model.predict(padded)
    log_salary = scaler.inverse_transform(prediction)[0][0]
    return np.expm1(log_salary)

example_job = "Data Scientist with 5 years of experience in machine learning and big data technologies."
predicted_salary = predict_salary(example_job)
print(f"\nPredicted salary: ${predicted_salary:.2f}")

example_job = "School director based in Missisipi state, 10 years of experience"
predicted_salary = predict_salary(example_job)
print(f"\nPredicted salary: ${predicted_salary:.2f}")

model.save('salary_prediction_model.h5')
joblib.dump(tokenizer, 'tokenizer.joblib')
joblib.dump(scaler, 'scaler.joblib')

print("Model, tokenizer, and scaler have been saved.")