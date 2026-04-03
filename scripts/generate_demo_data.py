#!/usr/bin/env python3
"""
Generate realistic demo data for ev-dashboard.
Sources: SDES, AVERE-France, IRVE (data.gouv.fr)
Coverage: 2015-2024 monthly registrations with full energy breakdown (VP, VUL, PL)
"""
import json, os, math

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
os.makedirs(OUT, exist_ok=True)

# ─── Helpers ────────────────────────────────────────────────────────────────

def lerp(a, b, t):
    return a + (b - a) * t

def smooth_growth(start, end, n, curve=1.5):
    """Generate n values from start to end with accelerating growth curve."""
    return [start + (end - start) * ((i / (n - 1)) ** curve) for i in range(n)]

# Monthly seasonal factors for vehicle registrations (index 0=Jan)
SEASONAL = [0.75, 0.80, 1.05, 0.95, 1.05, 1.10, 0.85, 0.85, 1.15, 1.05, 0.95, 1.45]

MONTHS = []
for y in range(2015, 2025):
    for m in range(1, 13):
        MONTHS.append(f"{y}-{m:02d}")
N = len(MONTHS)  # 120 months

# ─── VP (Véhicules Particuliers) ─────────────────────────────────────────────
# Total VP market: ~2.0M/yr 2015, ~1.82M/yr 2024 (monthly averages)
# Energy mix shifts dramatically over the decade

# Annual totals VP (approx from SDES)
VP_ANNUAL_TOTAL = {
    2015: 1917000, 2016: 2015000, 2017: 2111000, 2018: 2173000, 2019: 2201000,
    2020: 1650000, 2021: 1660000, 2022: 1530000, 2023: 1772000, 2024: 1822000,
}

# Annual share by energy for VP (percent), realistic progression
#   electric, hybrid_r, hybrid_nr, diesel, gasoline, gas
VP_SHARES = {
    # year: (elec, hyb_r, hyb_nr, diesel, gasoline, gas)
    2015: (0.8,  0.2,  3.5,  53.0, 42.0, 0.5),
    2016: (1.0,  0.3,  4.5,  52.0, 41.7, 0.5),
    2017: (1.2,  0.5,  5.8,  47.0, 44.9, 0.6),
    2018: (1.4,  1.0,  7.0,  44.0, 46.0, 0.6),
    2019: (1.9,  2.3,  8.5,  40.0, 46.7, 0.6),
    2020: (6.7,  4.8, 10.5,  28.0, 49.5, 0.5),
    2021: (9.8,  6.1, 12.2,  23.0, 48.5, 0.4),
    2022: (13.6, 7.5, 14.8,  17.0, 46.8, 0.3),
    2023: (16.8, 9.2, 16.5,  13.0, 44.2, 0.3),
    2024: (20.9,11.5, 17.8,  10.5, 39.0, 0.3),
}

def vp_month(year, month_idx):
    """Returns (elec, hyb_r, hyb_nr, diesel, gasoline, gas) for VP in given month."""
    annual = VP_ANNUAL_TOTAL[year]
    monthly_base = annual / 12
    seasonal = SEASONAL[month_idx]
    total = round(monthly_base * seasonal)

    shares = VP_SHARES[year]
    elec    = round(total * shares[0] / 100)
    hyb_r   = round(total * shares[1] / 100)
    hyb_nr  = round(total * shares[2] / 100)
    diesel  = round(total * shares[3] / 100)
    gas_fuel= round(total * shares[5] / 100)
    gasoline= total - elec - hyb_r - hyb_nr - diesel - gas_fuel
    return {
        "electric": max(0, elec),
        "hybrid_rechargeable": max(0, hyb_r),
        "hybrid": max(0, hyb_nr),
        "diesel": max(0, diesel),
        "gasoline": max(0, gasoline),
        "gas": max(0, gas_fuel),
        "total": total,
    }

# ─── VUL (Utilitaires Légers) ────────────────────────────────────────────────
# ~400k/yr, dominance diesel, montée progressive du VE

VUL_ANNUAL_TOTAL = {
    2015: 385000, 2016: 398000, 2017: 418000, 2018: 432000, 2019: 440000,
    2020: 368000, 2021: 382000, 2022: 395000, 2023: 410000, 2024: 425000,
}

VUL_SHARES = {
    # elec, hyb_r, hyb_nr, diesel, gasoline, gas
    2015: (0.5,  0.0,  0.5, 88.0, 10.5, 0.5),
    2016: (0.6,  0.0,  0.5, 87.5, 10.9, 0.5),
    2017: (0.8,  0.0,  0.8, 87.0, 10.9, 0.5),
    2018: (1.0,  0.1,  1.0, 86.0, 11.4, 0.5),
    2019: (1.5,  0.2,  1.2, 85.0, 11.6, 0.5),
    2020: (3.2,  0.3,  1.5, 82.0, 12.5, 0.5),
    2021: (5.0,  0.5,  2.0, 80.0, 12.0, 0.5),
    2022: (6.8,  0.8,  2.5, 77.0, 12.4, 0.5),
    2023: (8.5,  1.0,  3.0, 74.0, 13.0, 0.5),
    2024: (10.5, 1.5,  3.5, 70.5, 13.5, 0.5),
}

def vul_month(year, month_idx):
    annual = VUL_ANNUAL_TOTAL[year]
    total = round(annual / 12 * SEASONAL[month_idx])
    shares = VUL_SHARES[year]
    elec    = round(total * shares[0] / 100)
    hyb_r   = round(total * shares[1] / 100)
    hyb_nr  = round(total * shares[2] / 100)
    diesel  = round(total * shares[3] / 100)
    gas_fuel= round(total * shares[5] / 100)
    gasoline= total - elec - hyb_r - hyb_nr - diesel - gas_fuel
    return {
        "electric": max(0, elec),
        "hybrid_rechargeable": max(0, hyb_r),
        "hybrid": max(0, hyb_nr),
        "diesel": max(0, diesel),
        "gasoline": max(0, gasoline),
        "gas": max(0, gas_fuel),
        "total": total,
    }

# ─── PL (Poids Lourds) ───────────────────────────────────────────────────────
# ~45k/yr, quasi-100% diesel jusqu'en 2021, puis GNV et VE amorcés

PL_ANNUAL_TOTAL = {
    2015: 41000, 2016: 43000, 2017: 46000, 2018: 48000, 2019: 49000,
    2020: 43000, 2021: 45000, 2022: 47000, 2023: 48500, 2024: 50000,
}

PL_SHARES = {
    # elec, hyb_r, hyb_nr, diesel, gasoline, gas
    2015: (0.1,  0.0,  0.0, 98.8,  0.5, 0.6),
    2016: (0.1,  0.0,  0.0, 98.7,  0.5, 0.7),
    2017: (0.2,  0.0,  0.0, 98.5,  0.5, 0.8),
    2018: (0.2,  0.0,  0.0, 98.2,  0.5, 1.1),
    2019: (0.3,  0.0,  0.0, 97.5,  0.5, 1.7),
    2020: (0.4,  0.0,  0.0, 96.5,  0.5, 2.6),
    2021: (0.7,  0.0,  0.1, 95.0,  0.5, 3.7),
    2022: (1.2,  0.0,  0.1, 93.5,  0.5, 4.7),
    2023: (1.8,  0.0,  0.1, 92.0,  0.5, 5.6),
    2024: (2.5,  0.0,  0.2, 90.5,  0.5, 6.3),
}

def pl_month(year, month_idx):
    annual = PL_ANNUAL_TOTAL[year]
    total = round(annual / 12 * SEASONAL[month_idx])
    shares = PL_SHARES[year]
    elec    = max(1, round(total * shares[0] / 100))
    hyb_r   = round(total * shares[1] / 100)
    hyb_nr  = round(total * shares[2] / 100)
    gas_fuel= round(total * shares[5] / 100)
    diesel  = round(total * shares[3] / 100)
    gasoline= total - elec - hyb_r - hyb_nr - diesel - gas_fuel
    return {
        "electric": max(0, elec),
        "hybrid_rechargeable": max(0, hyb_r),
        "hybrid": max(0, hyb_nr),
        "diesel": max(0, diesel),
        "gasoline": max(0, gasoline),
        "gas": max(0, gas_fuel),
        "total": total,
    }

# ─── Build monthly JSON ──────────────────────────────────────────────────────
registrations_monthly = []
for month in MONTHS:
    y, m = int(month[:4]), int(month[5:7])
    vp = vp_month(y, m - 1)
    vul = vul_month(y, m - 1)
    pl = pl_month(y, m - 1)
    registrations_monthly.append({"month": month, "vp": vp, "vul": vul, "pl": pl})

with open(os.path.join(OUT, 'registrations_monthly.json'), 'w', encoding='utf-8') as f:
    json.dump(registrations_monthly, f, indent=2, ensure_ascii=False)
print(f"✓ registrations_monthly.json ({len(registrations_monthly)} mois, 2015–2024)")

# ─── Build annual JSON ───────────────────────────────────────────────────────
def sum_energy(rows, key):
    d = {"electric": 0, "hybrid_rechargeable": 0, "hybrid": 0,
         "diesel": 0, "gasoline": 0, "gas": 0, "total": 0}
    for r in rows:
        for k in d:
            d[k] += r[key][k]
    return d

registrations_annual = []
for year in range(2015, 2025):
    rows = [r for r in registrations_monthly if r["month"].startswith(str(year))]
    vp_sum = sum_energy(rows, "vp")
    vul_sum = sum_energy(rows, "vul")
    pl_sum = sum_energy(rows, "pl")
    vp_sum["ev_share"] = round(vp_sum["electric"] / vp_sum["total"] * 100, 1)
    vul_sum["ev_share"] = round(vul_sum["electric"] / vul_sum["total"] * 100, 1)
    pl_sum["ev_share"] = round(pl_sum["electric"] / pl_sum["total"] * 100, 1)
    registrations_annual.append({"year": year, "vp": vp_sum, "vul": vul_sum, "pl": pl_sum})

with open(os.path.join(OUT, 'registrations_annual.json'), 'w', encoding='utf-8') as f:
    json.dump(registrations_annual, f, indent=2)
print(f"✓ registrations_annual.json ({len(registrations_annual)} années)")

# ─── Charging history (2021–2024) — unchanged structure ─────────────────────
charging_months = []
for y in range(2021, 2025):
    for m in range(1, 13):
        charging_months.append(f"{y}-{m:02d}")

charging_public = [
    42000, 44000, 46500, 48000, 50000, 52000, 54000, 56500, 59000, 61500, 64000, 67000,
    69000, 71500, 74000, 76500, 79000, 82000, 85000, 88000, 91500, 94500, 98000, 102000,
    105000, 108000, 111000, 114000, 117000, 120000, 122500, 124500, 126500, 128000, 129500, 130500,
    131500, 132500, 133800, 135200, 136800, 138200, 139500, 141000, 143000, 145500, 148000, 151000,
]
charging_history = [
    {"month": m, "public": p, "private": round(p * 0.35), "total": p + round(p * 0.35)}
    for m, p in zip(charging_months, charging_public)
]
with open(os.path.join(OUT, 'charging_points_history.json'), 'w') as f:
    json.dump(charging_history, f, indent=2)
print("✓ charging_points_history.json")

# ─── Other files (unchanged) ─────────────────────────────────────────────────
charging_by_power = [
    {"range": "≤7 kW",   "count": 28000, "percent": 18.5},
    {"range": "7–22 kW", "count": 65000, "percent": 43.1},
    {"range": "22–50 kW","count": 28000, "percent": 18.5},
    {"range": "50–150 kW","count": 18000,"percent": 11.9},
    {"range": ">150 kW", "count": 12000, "percent": 8.0},
]
with open(os.path.join(OUT, 'charging_by_power.json'), 'w') as f:
    json.dump(charging_by_power, f, indent=2)
print("✓ charging_by_power.json")

charging_by_operator = [
    {"operator": "Total Energies / Enedis", "count": 18500, "percent": 12.3},
    {"operator": "ChargePoint",             "count": 14200, "percent": 9.4},
    {"operator": "Izivia (EDF)",            "count": 12800, "percent": 8.5},
    {"operator": "Freshmile",               "count": 10500, "percent": 7.0},
    {"operator": "Lidl",                    "count": 9800,  "percent": 6.5},
    {"operator": "Electra",                 "count": 8200,  "percent": 5.4},
    {"operator": "Fastned",                 "count": 6500,  "percent": 4.3},
    {"operator": "Ionity",                  "count": 5200,  "percent": 3.4},
    {"operator": "Shell Recharge",          "count": 4800,  "percent": 3.2},
    {"operator": "Autres",                  "count": 60500, "percent": 40.1},
]
with open(os.path.join(OUT, 'charging_by_operator.json'), 'w') as f:
    json.dump(charging_by_operator, f, indent=2)
print("✓ charging_by_operator.json")

regions = [
    ("Île-de-France",              "11", 95000, 7.6, 29000, 23.3),
    ("Auvergne-Rhône-Alpes",       "84", 48000, 6.1, 16500, 21.0),
    ("Nouvelle-Aquitaine",         "75", 32000, 5.4, 12500, 21.1),
    ("Occitanie",                  "76", 27000, 5.2, 10200, 19.7),
    ("Hauts-de-France",            "32", 22000, 4.3,  9800, 19.1),
    ("Provence-Alpes-Côte d'Azur", "93", 24000, 4.8, 10500, 21.0),
    ("Grand Est",                  "44", 20000, 4.1,  8800, 18.1),
    ("Pays de la Loire",           "52", 18000, 4.8,  7200, 19.2),
    ("Bretagne",                   "53", 15000, 4.5,  6200, 18.6),
    ("Normandie",                  "28", 14000, 4.2,  5800, 17.4),
    ("Bourgogne-Franche-Comté",    "27", 11000, 4.0,  4800, 17.4),
    ("Centre-Val de Loire",        "24", 10500, 4.1,  4500, 17.6),
    ("Corse",                      "94",  1800, 5.5,   900, 27.6),
]
geo_regs = [{"region": r[0], "code": r[1], "count": r[2], "per_1000_inhabitants": r[3]} for r in regions]
geo_chr  = [{"region": r[0], "code": r[1], "count": r[4], "per_1000_inhabitants": r[5]} for r in regions]
with open(os.path.join(OUT, 'geo_registrations.json'), 'w', encoding='utf-8') as f:
    json.dump(geo_regs, f, indent=2, ensure_ascii=False)
with open(os.path.join(OUT, 'geo_charging.json'), 'w', encoding='utf-8') as f:
    json.dump(geo_chr, f, indent=2, ensure_ascii=False)
print("✓ geo_registrations.json + geo_charging.json")

metadata = {
    "last_update": "2025-01-01",
    "sources": ["SDES", "AVERE-France", "IRVE (data.gouv.fr)", "AAAdata", "INSEE"],
    "period_registrations": {"start": "2015-01", "end": "2024-12"},
    "period_charging": {"start": "2021-01", "end": "2024-12"},
}
with open(os.path.join(OUT, 'metadata.json'), 'w') as f:
    json.dump(metadata, f, indent=2)
print("✓ metadata.json")
print("\n✅ All files generated (2015–2024, full energy breakdown)")
