#!/usr/bin/env python3
"""
Generate realistic demo data for ev-dashboard based on public French EV statistics.
Data approximated from SDES, AVERE-France, IRVE sources (2020-2024).
"""
import json
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
os.makedirs(OUT, exist_ok=True)

# ─── Registrations mensuelles VP 100% électrique (France) ───────────────────
# Source: SDES immatriculations VP électrique 2020-2024
# Données approximées à partir des bilans mensuels publiés
VP_MONTHLY = [
    # 2020
    8200, 7100, 4300, 3500, 8100, 10200, 12100, 13200, 16100, 13500, 18900, 22500,
    # 2021
    10200, 11800, 16200, 17500, 19200, 18100, 19800, 22100, 24300, 23100, 25800, 32100,
    # 2022
    15100, 18200, 24300, 19800, 21200, 23100, 26800, 28900, 34100, 29300, 33200, 38500,
    # 2023
    20200, 22800, 29400, 24100, 26700, 29300, 31800, 36200, 38900, 33600, 39100, 48700,
    # 2024
    24100, 26300, 34200, 27900, 30100, 33800, 36200, 41500, 45300, 39800, 46200, 57800,
]

VUL_MONTHLY = [
    # 2020
    1800, 1600, 900, 800, 1700, 2100, 2500, 2700, 3200, 2800, 3900, 4500,
    # 2021
    2100, 2400, 3300, 3600, 4000, 3700, 4100, 4600, 5000, 4800, 5300, 6600,
    # 2022
    3100, 3700, 4900, 4100, 4300, 4700, 5500, 5900, 7000, 6000, 6800, 7900,
    # 2023
    4100, 4700, 6000, 4900, 5500, 6000, 6500, 7400, 8000, 6900, 8000, 9900,
    # 2024
    4900, 5400, 7000, 5700, 6200, 6900, 7400, 8500, 9300, 8200, 9500, 11800,
]

PL_MONTHLY = [
    # 2020
    60, 50, 30, 25, 55, 70, 85, 95, 110, 95, 130, 155,
    # 2021
    75, 85, 115, 130, 145, 135, 150, 165, 185, 175, 200, 245,
    # 2022
    115, 140, 185, 155, 165, 180, 210, 225, 265, 230, 260, 300,
    # 2023
    155, 180, 230, 190, 215, 235, 255, 290, 315, 270, 310, 385,
    # 2024
    190, 210, 270, 220, 245, 275, 295, 335, 370, 320, 375, 460,
]

months = []
for year in range(2020, 2025):
    for m in range(1, 13):
        months.append(f"{year}-{m:02d}")

registrations_monthly = []
for i, month in enumerate(months):
    vp = VP_MONTHLY[i]
    vul = VUL_MONTHLY[i]
    pl = PL_MONTHLY[i]
    registrations_monthly.append({
        "month": month,
        "vp": vp,
        "vul": vul,
        "pl": pl,
        "total": vp + vul + pl
    })

with open(os.path.join(OUT, 'registrations_monthly.json'), 'w', encoding='utf-8') as f:
    json.dump(registrations_monthly, f, indent=2, ensure_ascii=False)
print("✓ registrations_monthly.json")

# ─── Parts de marché annuelles ───────────────────────────────────────────────
# Source: SDES bilans annuels immatriculations VP neuves
registrations_annual = [
    {"year": 2019, "electric": 40768, "hybrid": 116775, "thermal": 1928756, "total": 2201000, "ev_share": 1.9},
    {"year": 2020, "electric": 110921, "hybrid": 186688, "thermal": 1617000, "total": 1650000, "ev_share": 6.7},
    {"year": 2021, "electric": 163000, "hybrid": 235000, "thermal": 1474000, "total": 1660000, "ev_share": 9.8},
    {"year": 2022, "electric": 208000, "hybrid": 315000, "thermal": 1370000, "total": 1530000, "ev_share": 13.6},
    {"year": 2023, "electric": 296000, "hybrid": 352000, "thermal": 1283000, "total": 1772000, "ev_share": 16.8},
    {"year": 2024, "electric": 381000, "hybrid": 415000, "thermal": 1186000, "total": 1822000, "ev_share": 20.9},
]
with open(os.path.join(OUT, 'registrations_annual.json'), 'w', encoding='utf-8') as f:
    json.dump(registrations_annual, f, indent=2)
print("✓ registrations_annual.json")

# ─── Historique points de charge publics ────────────────────────────────────
# Source: AVERE-France baromètre mensuel / IRVE
# Fin 2024: ~130 000 PDC publics en France
charging_months = []
for year in range(2021, 2025):
    for m in range(1, 13):
        charging_months.append(f"{year}-{m:02d}")

charging_public = [
    # 2021
    42000, 44000, 46500, 48000, 50000, 52000, 54000, 56500, 59000, 61500, 64000, 67000,
    # 2022
    69000, 71500, 74000, 76500, 79000, 82000, 85000, 88000, 91500, 94500, 98000, 102000,
    # 2023
    105000, 108000, 111000, 114000, 117000, 120000, 122500, 124500, 126500, 128000, 129500, 130500,
    # 2024
    131500, 132500, 133800, 135200, 136800, 138200, 139500, 141000, 143000, 145500, 148000, 151000,
]

charging_history = []
for i, month in enumerate(charging_months):
    pub = charging_public[i]
    priv = int(pub * 0.35)
    charging_history.append({
        "month": month,
        "public": pub,
        "private": priv,
        "total": pub + priv
    })

with open(os.path.join(OUT, 'charging_points_history.json'), 'w', encoding='utf-8') as f:
    json.dump(charging_history, f, indent=2)
print("✓ charging_points_history.json")

# ─── PDC par puissance ───────────────────────────────────────────────────────
# Source: IRVE data.gouv.fr — répartition fin 2024
charging_by_power = [
    {"range": "≤7 kW", "count": 28000, "percent": 18.5},
    {"range": "7–22 kW", "count": 65000, "percent": 43.1},
    {"range": "22–50 kW", "count": 28000, "percent": 18.5},
    {"range": "50–150 kW", "count": 18000, "percent": 11.9},
    {"range": ">150 kW", "count": 12000, "percent": 8.0},
]
with open(os.path.join(OUT, 'charging_by_power.json'), 'w', encoding='utf-8') as f:
    json.dump(charging_by_power, f, indent=2)
print("✓ charging_by_power.json")

# ─── Top opérateurs ─────────────────────────────────────────────────────────
# Source: IRVE data.gouv.fr — top opérateurs fin 2024
charging_by_operator = [
    {"operator": "Enedis / Total Energies", "count": 18500, "percent": 12.3},
    {"operator": "ChargePoint", "count": 14200, "percent": 9.4},
    {"operator": "Izivia (EDF)", "count": 12800, "percent": 8.5},
    {"operator": "Freshmile", "count": 10500, "percent": 7.0},
    {"operator": "Lidl", "count": 9800, "percent": 6.5},
    {"operator": "Electra", "count": 8200, "percent": 5.4},
    {"operator": "Fastned", "count": 6500, "percent": 4.3},
    {"operator": "Ionity", "count": 5200, "percent": 3.4},
    {"operator": "Shell Recharge", "count": 4800, "percent": 3.2},
    {"operator": "Autres", "count": 60500, "percent": 40.1},
]
with open(os.path.join(OUT, 'charging_by_operator.json'), 'w', encoding='utf-8') as f:
    json.dump(charging_by_operator, f, indent=2)
print("✓ charging_by_operator.json")

# ─── Données géographiques par région ────────────────────────────────────────
# Source: SDES + IRVE — données régionales approximées
regions = [
    ("Île-de-France",         "11", 95000, 7.6, 29000, 23.3),
    ("Auvergne-Rhône-Alpes",  "84", 48000, 6.1, 16500, 21.0),
    ("Nouvelle-Aquitaine",    "75", 32000, 5.4, 12500, 21.1),
    ("Occitanie",             "76", 27000, 5.2, 10200, 19.7),
    ("Hauts-de-France",       "32", 22000, 4.3,  9800, 19.1),
    ("Provence-Alpes-Côte d'Azur", "93", 24000, 4.8, 10500, 21.0),
    ("Grand Est",             "44", 20000, 4.1,  8800, 18.1),
    ("Pays de la Loire",      "52", 18000, 4.8,  7200, 19.2),
    ("Bretagne",              "53", 15000, 4.5,  6200, 18.6),
    ("Normandie",             "28", 14000, 4.2,  5800, 17.4),
    ("Bourgogne-Franche-Comté","27", 11000, 4.0,  4800, 17.4),
    ("Centre-Val de Loire",   "24", 10500, 4.1,  4500, 17.6),
    ("Corse",                 "94",  1800, 5.5,   900, 27.6),
]

geo_registrations = [
    {
        "region": r[0], "code": r[1],
        "count": r[2], "per_1000_inhabitants": r[3]
    }
    for r in regions
]

geo_charging = [
    {
        "region": r[0], "code": r[1],
        "count": r[4], "per_1000_inhabitants": r[5]
    }
    for r in regions
]

with open(os.path.join(OUT, 'geo_registrations.json'), 'w', encoding='utf-8') as f:
    json.dump(geo_registrations, f, indent=2, ensure_ascii=False)
print("✓ geo_registrations.json")

with open(os.path.join(OUT, 'geo_charging.json'), 'w', encoding='utf-8') as f:
    json.dump(geo_charging, f, indent=2, ensure_ascii=False)
print("✓ geo_charging.json")

print("\nAll data files generated successfully!")
