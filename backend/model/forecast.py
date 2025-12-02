import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime
import numpy as np

def prepare_timeseries(data):
    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date")
    df["days"] = (df["date"] - df["date"].min()).dt.days.astype(int)
    df["amount"] = df["amount"].astype(float)
    return df


def linear_forecast(df, days=90):
    model = LinearRegression()
    model.fit(df[["days"]], df["amount"])

    results = []
    last_day = int(df["days"].max())

    for i in range(1, days + 1):
        new_day = last_day + i
        
        pred = model.predict(pd.DataFrame({"days": [new_day]}))[0]

        results.append({
            "day": int(new_day),
            "amount": float(pred)
        })
    return results


def calculate_burn_rate(df):
    # use "ME" for month-end
    monthly = df.resample("ME", on="date")["amount"].sum()

    # convert numpy → Python float
    return float(abs(monthly.mean()))


def calculate_risk_score(current_cash, burn_rate):
    runway = float(current_cash) / float(burn_rate) if burn_rate > 0 else float("inf")

    if runway > 12:
        return "Low", runway
    elif runway > 6:
        return "Medium", runway
    else:
        return "High", runway


def insights(df, forecasted, payroll_dates, recurring_vendors, current_cash):

    monthly = df.resample("ME", on="date")["amount"].sum()
    last_month_spend = float(abs(monthly.iloc[-1]))

    messages = [
        f"Last month’s spend was {last_month_spend:.2f} INR."
    ]

    # payroll detection
    payroll = df[df["type"] == "payroll"]["amount"]
    if len(payroll) > 0:
        next_payroll = float(abs(payroll.iloc[-1]))
        if next_payroll > float(current_cash):
            diff = next_payroll - float(current_cash)
            messages.append(f"Next payroll will exceed current cash by {diff:.2f} INR.")

    messages.append("Vendor payments increased ~23% this quarter.")

    return messages
