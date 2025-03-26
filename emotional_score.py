import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.linear_model import LinearRegression
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_squared_error, r2_score

file_path = "emotional_score.csv"
df = pd.read_csv(file_path)

positive_factors = ["Happiness Level", "Social Support"]
negative_factors = ["Stress Level", "Anxiety Level"]

scaler = MinMaxScaler()
df[positive_factors] = scaler.fit_transform(df[positive_factors])
df[negative_factors] = scaler.fit_transform(df[negative_factors])

df["Emotional Score"] = (
    df[positive_factors].sum(axis=1) - df[negative_factors].sum(axis=1)
) * 50 + 50

df.to_csv("emotional_score.csv", index=False)

df = pd.read_csv("emotional_score.csv")
X = df.drop(columns=["Emotional Score"])
Y = df["Emotional Score"]

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

lin_reg = LinearRegression()
lin_reg.fit(X_train, Y_train)
Y_pred_lin = lin_reg.predict(X_test)

nn_reg = MLPRegressor(hidden_layer_sizes=(256, 128, 64, 32, 16, 8, 4), activation='relu', max_iter=500, random_state=42)
nn_reg.fit(X_train_scaled, Y_train)
Y_pred_nn = nn_reg.predict(X_test_scaled)

def evaluate_model(name, Y_true, Y_pred):
    mse = mean_squared_error(Y_true, Y_pred)
    r2 = r2_score(Y_true, Y_pred)
    print(f"{name} Model:\nMSE: {mse:.4f}\nR2 Score: {r2:.4f}\n")

evaluate_model("Linear Regression", Y_test, Y_pred_lin)
evaluate_model("Neural Network Regressor", Y_test, Y_pred_nn)

plt.figure(figsize=(10, 6))
sns.histplot(df["Emotional Score"], bins=30, kde=True, color='blue')
plt.title("Distribution of Emotional Score")
plt.xlabel("Emotional Score")
plt.ylabel("Frequency")
plt.show()

features_to_plot = ["Stress Level", "Anxiety Level", "Happiness Level"]
for feature in features_to_plot:
    plt.figure(figsize=(8, 5))
    sns.histplot(df[feature], bins=30, kde=True, color='green')
    plt.title(f"Distribution of {feature}")
    plt.xlabel(feature)
    plt.ylabel("Frequency")
    plt.show()
