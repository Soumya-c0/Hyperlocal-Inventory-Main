import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split

# 1. Generate Synthetic Tabular Data
np.random.seed(42)
num_samples = 2000

# Feature variables: Vehicle load (0-100 kg) plus road steepness (-10 to 20 degrees)
weights = np.random.uniform(0, 100, num_samples)
gradients = np.random.uniform(-10, 20, num_samples)

# Target variable: Non-linear emission calculation including a feature interaction term
co2_emissions = 150 + (weights * 1.2) + (gradients * 2.5) + (weights * gradients * 0.05) + np.random.normal(0, 5, num_samples)

X = np.column_stack((weights, gradients))
y = co2_emissions

# 2. Train Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Model Initialization
model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100, learning_rate=0.1, max_depth=4)
model.fit(X_train, y_train)

# 4. Save Binary Weights
model.save_model('carbon_model.json')
print("Model successfully trained. Weights saved to carbon_model.json")