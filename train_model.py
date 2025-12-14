import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import joblib
print("Starting model training...")
data = {
    # Sub 1 (Calculus): Score: 89%, Avg: 76.4%, Max: 96% | IAs: 20, 19, 8, 15
    'student_percent': [89, 91, 81, 86, 87], 
    'relative_to_avg': [12.6, 16.5, 4.1, 9.1, 10.3], # (e.g., 89 - 76.4 = 12.6)
    'relative_to_max': [7, 0, 10, 5, 0],             # (e.g., 96 - 89 = 7)
    'ia1_percent': [100, 90, 80, 95, 100],           # (e.g., 20/20 = 100%)
    'ia2_percent': [95, 85, 90, 95, 75],             # (e.g., 19/20 = 95%)
    'quiz_percent': [80, 90, 80, 80, 80],            # (e.g., 8/10 = 80%)
    'aat_percent': [75, 100, 75, 70, 90],            # (e.g., 15/20 = 75%)
    'priority': ['Low', 'Low', 'Low', 'Low', 'Low']  
}
new_data = {
    # Hypothetical "Medium" subject
    'student_percent': [65], 
    'relative_to_avg': [-10.0],  # 65% vs 75% avg
    'relative_to_max': [25.0],   # 65% vs 90% max
    'ia1_percent': [90],         # Good IA1
    'ia2_percent': [40],         # Bad IA2
    'quiz_percent': [70],
    'aat_percent': [60],
    'priority': ['Medium']
}
new_data_2 = {
    'student_percent': [42], 
    'relative_to_avg': [-33.0],
    'relative_to_max': [48.0],  
    'ia1_percent': [50],
    'ia2_percent': [30],
    'quiz_percent': [40],
    'aat_percent': [50],
    'priority': ['High']
}
df = pd.DataFrame(data)
df = pd.concat([df, pd.DataFrame(new_data)], ignore_index=True)
df = pd.concat([df, pd.DataFrame(new_data_2)], ignore_index=True)
print("--- Training Data ---")
print(df)
print("---------------------")
features = ['student_percent', 'relative_to_avg', 'relative_to_max', 'ia1_percent', 'ia2_percent', 'quiz_percent', 'aat_percent']
X = df[features] 
y = df['priority']
model = DecisionTreeClassifier(max_depth=4, random_state=42)
model.fit(X, y)
print("Model trained successfully on YOUR 7 features!")
joblib.dump(model, 'priority_model.joblib')
print("Model saved as 'priority_model.joblib'")
print("You can now run the main server.")