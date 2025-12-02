from fastapi import FastAPI
import json
from model.forecast import (
    prepare_timeseries,
    linear_forecast,
    calculate_burn_rate,
    calculate_risk_score,
    insights,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from io import BytesIO

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {"message": "API is running"}


@app.get("/forecast")
def get_forecast():

    # load dataset
    with open("data/transactions.json") as f:
        data = json.load(f)

    # forecasting pipeline
    df = prepare_timeseries(data["transactions"])
    forecast_90 = linear_forecast(df, 90)

    burn_rate = calculate_burn_rate(df)
    risk_score, runway = calculate_risk_score(data["current_cash"], burn_rate)

    insight_msgs = insights(
        df,
        forecast_90,
        data["payroll_dates"],
        data["recurring_vendors_monthly"],
        data["current_cash"]
    )

    return {
        "cashflow_forecast": forecast_90,
        "burn_rate": float(burn_rate),
        "risk_score": str(risk_score),
        "runway_months": float(runway),
        "insights": [str(x) for x in insight_msgs]
    }


@app.get("/report/pdf")
def download_pdf():

    with open("data/transactions.json") as f:
        raw = json.load(f)

    df = prepare_timeseries(raw["transactions"])
    forecast_90 = linear_forecast(df, 90)
    burn_rate = calculate_burn_rate(df)
    risk_score, runway = calculate_risk_score(raw["current_cash"], burn_rate)

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)

    width, height = A4

    # Title
    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, height - 50, "AI Treasury Financial Report")

    c.setFont("Helvetica", 12)
    c.drawString(50, height - 100, f"Risk Score: {risk_score}")
    c.drawString(50, height - 120, f"Runway: {runway:.1f} months")
    c.drawString(50, height - 140, f"Burn Rate: {burn_rate:.2f} INR/month")

    y = height - 180
    c.drawString(50, y, "Next 5 Forecasted Days:")
    y -= 20

    for row in forecast_90[:5]:
        c.drawString(60, y, f"Day {row['day']}: {row['amount']:.2f} INR")
        y -= 20

    c.showPage()
    c.save()
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=treasury_report.pdf"},
    )
