"""
Sample Expense Data Generator for SmartSpend AI
Creates realistic personal expense transaction dataset for testing and demonstration.
Spans 12 full months (Jan 2025 - Dec 2025) across diverse categories, payment modes,
and includes calibrated unusual transactions for anomaly detection validation.
"""

import csv
import random
from datetime import datetime, timedelta

def generate_sample_dataset(filepath="e:/SmartSpend/data/sample_transactions.csv", num_records=365):
    random.seed(42)  # For reproducible academic evaluation
    
    categories = {
        "Food & Dining": {"range": (120, 1400), "freq": 0.28, "modes": ["UPI", "Debit Card", "Cash"], 
                          "desc": ["Zomato Food Order", "Cafe Coffee Day", "Office Cafeteria Lunch", "Local Dhaba Dinner", "Swiggy Grocery Snack", "Weekend Restaurant Dinner", "Breakfast & Tea Stall", "Fast Food Burger & Fries"]},
        "Groceries": {"range": (350, 3800), "freq": 0.22, "modes": ["UPI", "Credit Card", "Debit Card"],
                      "desc": ["Supermarket Weekly Groceries", "Fresh Vegetables & Fruits", "Dairy Milk & Eggs Delivery", "Spices & Cooking Essentials", "Organic Mart Essentials", "Blinkit Daily Essentials"]},
        "Transportation": {"range": (40, 750), "freq": 0.16, "modes": ["UPI", "Cash", "Debit Card"],
                           "desc": ["Metro Rail Smartcard Recharge", "Uber Ride to Office", "Ola Auto Ride", "City Bus Pass", "Petrol Fuel Refill", "Auto Rickshaw Fare", "Airport Shuttle Cab"]},
        "Bills & Utilities": {"range": (600, 4200), "freq": 0.10, "modes": ["Net Banking", "UPI", "Credit Card"],
                              "desc": ["Electricity Power Bill", "Broadband Wi-Fi Bill", "Mobile Postpaid Recharge", "LPG Gas Cylinder Booking", "Water Supply Utility Charge", "Housing Society Maintenance"]},
        "Shopping": {"range": (450, 4500), "freq": 0.10, "modes": ["Credit Card", "UPI", "Debit Card"],
                     "desc": ["Amazon Online Shopping", "Myntra Clothing Order", "Footwear & Shoes Store", "Home Furnishing Goods", "Electronics Accessories Cable", "Books & Study Stationery"]},
        "Entertainment": {"range": (199, 1800), "freq": 0.06, "modes": ["UPI", "Credit Card"],
                          "desc": ["BookMyShow Cinema Tickets", "Netflix Premium Subscription", "Spotify Annual Plan", "Gaming Arcade & Bowling", "Weekend Streaming Movies"]},
        "Healthcare": {"range": (250, 2600), "freq": 0.05, "modes": ["UPI", "Debit Card", "Cash"],
                       "desc": ["Apollo Pharmacy Medicines", "Doctor Consultation Clinic", "Diagnostic Blood Test Lab", "Dental Routine Checkup", "Vitamin & Protein Supplements"]},
        "Education": {"range": (400, 3200), "freq": 0.03, "modes": ["Net Banking", "UPI", "Debit Card"],
                      "desc": ["Coursera Certification Course", "Udemy Python Programming Course", "Technical Reference Textbooks", "Coding Bootcamp Monthly Fee", "Academic Seminar Registration"]}
    }

    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 12, 31)
    date_delta = (end_date - start_date).days

    cat_list = list(categories.keys())
    cat_weights = [categories[c]["freq"] for c in cat_list]

    transactions = []

    # Generate regular realistic distribution
    for _ in range(num_records):
        day_offset = random.randint(0, date_delta)
        tx_date = (start_date + timedelta(days=day_offset)).strftime("%Y-%m-%d")
        
        cat = random.choices(cat_list, weights=cat_weights, k=1)[0]
        c_info = categories[cat]
        
        # Log-normal leaning amount within range
        low, high = c_info["range"]
        amount = round(random.triangular(low, high, low + (high - low) * 0.35), 2)
        
        payment_mode = random.choice(c_info["modes"])
        description = random.choice(c_info["desc"])
        
        transactions.append({
            "Date": tx_date,
            "Category": cat,
            "Amount": amount,
            "Payment_Mode": payment_mode,
            "Description": description
        })

    # Intentionally inject 5 realistic unusual transactions / potential anomalies across the year
    anomalies = [
        {"Date": "2025-04-18", "Category": "Shopping", "Amount": 48500.00, "Payment_Mode": "Credit Card", "Description": "Luxury Flagship Smartphone & Earbuds Purchase"},
        {"Date": "2025-07-22", "Category": "Healthcare", "Amount": 34500.00, "Payment_Mode": "Net Banking", "Description": "Emergency Hospitalization Dental Root Canal & Surgery"},
        {"Date": "2025-10-12", "Category": "Entertainment", "Amount": 26800.00, "Payment_Mode": "Credit Card", "Description": "VIP Music Festival International Weekend Passes"},
        {"Date": "2025-11-28", "Category": "Shopping", "Amount": 41200.00, "Payment_Mode": "Credit Card", "Description": "Black Friday Mega Deal 4K Smart OLED Television"},
        {"Date": "2025-12-24", "Category": "Food & Dining", "Amount": 18900.00, "Payment_Mode": "Credit Card", "Description": "Year-End Corporate Family Celebration Banquet Party"}
    ]

    transactions.extend(anomalies)

    # Sort transactions chronologically
    transactions.sort(key=lambda x: x["Date"])

    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["Date", "Category", "Amount", "Payment_Mode", "Description"])
        writer.writeheader()
        writer.writerows(transactions)

    print(f"Successfully generated {len(transactions)} sample expense transactions to {filepath}")

if __name__ == "__main__":
    generate_sample_dataset()
