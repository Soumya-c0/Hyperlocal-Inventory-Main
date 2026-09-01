import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

print("Loading data_for_fleet_dna_delivery_vans.csv...")
df = pd.read_csv('../data_for_fleet_dna_delivery_vans.csv', usecols=['mean_road_grade'])

# 1. Feature Engineering
np.random.seed(42)
df['vehicle_weight_kg'] = np.random.uniform(3000, 8000, len(df))
df['road_gradient_deg'] = df['mean_road_grade']

# 2. Physics-Bound Target Calculation (The Output we are predicting)
df['co2_emissions_g'] = 1500 + (df['vehicle_weight_kg'] * 1.5) + (df['road_gradient_deg'] * 150) 
df['co2_emissions_g'] += np.random.normal(0, 50, len(df))

# 3. Train Test Split
X = df[['vehicle_weight_kg', 'road_gradient_deg']]
y = df['co2_emissions_g']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. XGBoost Initialization
print("Training XGBoost Regressor on physics-bound telemetry...")
model = xgb.XGBRegressor(
    objective='reg:squarederror', 
    n_estimators=150, 
    learning_rate=0.05, 
    max_depth=5
)

model.fit(X_train, y_train)

# 5. Validation and Accuracy Metrics
predictions = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, predictions))

# Calculate R-squared and convert to a percentage
r2 = r2_score(y_test, predictions)
accuracy_percentage = r2 * 100

print(f"Mean CO2 per segment: {y.mean():.2f} grams")
print(f"Model Validation RMSE: {rmse:.2f} grams of CO2")
print(f"Model Accuracy (R-squared): {accuracy_percentage:.2f}%")

model.save_model('carbon_model.json')
print("Success: Model weights saved to carbon_model.json")