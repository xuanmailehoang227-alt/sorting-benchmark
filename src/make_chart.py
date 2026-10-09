#!/usr/bin/env python3
"""Ve bieu do cot so sanh thoi gian thuc thi cua 4 thuat toan sap xep."""
import csv

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

# Mau theo bang mau categorical (dataviz skill), slot 1-4
COLORS = {
    "QuickSort_ms": "#2a78d6",   # blue
    "HeapSort_ms": "#eb6834",    # orange
    "MergeSort_ms": "#1baf7a",   # aqua
    "StdSort_ms": "#eda100",     # yellow
}
LABELS = {
    "QuickSort_ms": "QuickSort",
    "HeapSort_ms": "HeapSort",
    "MergeSort_ms": "MergeSort",
    "StdSort_ms": "sort (C++)",
}

SURFACE = "#fcfcfb"
PRIMARY_INK = "#0b0b0b"
SECONDARY_INK = "#52514e"
MUTED = "#898781"
GRIDLINE = "#e1e0d9"
BASELINE = "#c3c2b7"

rows = []
with open("results/results.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        rows.append(row)

labels = [r["Dataset"] if r["Dataset"] != "Trung binh" else "TB" for r in rows]
series_keys = ["QuickSort_ms", "HeapSort_ms", "MergeSort_ms", "StdSort_ms"]
data = {k: [float(r[k]) for r in rows] for k in series_keys}

n = len(labels)
x = np.arange(n)
width = 0.19

fig, ax = plt.subplots(figsize=(12, 6.2), dpi=150)
fig.patch.set_facecolor(SURFACE)
ax.set_facecolor(SURFACE)

for i, key in enumerate(series_keys):
    offset = (i - 1.5) * width
    bars = ax.bar(
        x + offset, data[key], width,
        label=LABELS[key], color=COLORS[key],
        edgecolor=SURFACE, linewidth=0.6,
    )

# Highlight cot cuoi (Trung binh) bang vien dam hon + nhan nen de phan biet
ax.axvspan(n - 1 - 0.5, n - 1 + 0.5, color=GRIDLINE, alpha=0.6, zorder=0)

ax.set_xticks(x)
ax.set_xticklabels(labels, color=SECONDARY_INK, fontsize=10)
ax.set_xlabel("Bộ dữ liệu (1–10) và Trung bình", color=SECONDARY_INK, fontsize=11)
ax.set_ylabel("Thời gian thực thi (ms)", color=SECONDARY_INK, fontsize=11)
ax.set_title(
    "So sánh thời gian thực thi của QuickSort, HeapSort, MergeSort và std::sort\n"
    "(mỗi dãy ~1.000.000 số thực)",
    color=PRIMARY_INK, fontsize=13, fontweight="bold", pad=14,
)

ax.grid(axis="y", color=GRIDLINE, linewidth=0.8, zorder=0)
ax.set_axisbelow(True)

for spine in ["top", "right"]:
    ax.spines[spine].set_visible(False)
for spine in ["left", "bottom"]:
    ax.spines[spine].set_color(BASELINE)

ax.tick_params(colors=MUTED)

legend = ax.legend(
    loc="upper center", bbox_to_anchor=(0.5, -0.12), ncol=4,
    frameon=False, fontsize=10, labelcolor=SECONDARY_INK,
)

plt.tight_layout()
plt.savefig("results/chart.png", facecolor=SURFACE, bbox_inches="tight")
print("Da luu bieu do: results/chart.png")
