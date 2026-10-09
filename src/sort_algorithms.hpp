// sort_algorithms.hpp
// Cai dat QuickSort, HeapSort, MergeSort cho mang double.

#ifndef SORT_ALGORITHMS_HPP
#define SORT_ALGORITHMS_HPP

#include <algorithm>
#include <random>
#include <vector>

// ============================= QUICKSORT =============================
// Dung pivot ngau nhien (random pivot) de tranh truong hop xau O(n^2)
// khi du lieu da co thu tu (tang dan / giam dan).
// Sau khi phan hoach (partition), de quy vao phan nho hon va dung vong
// lap (khong de quy) cho phan lon hon, gioi han do sau ngan xep O(log n).

namespace detail {

inline std::mt19937 &quicksortRng() {
    static std::mt19937 rng(12345);
    return rng;
}

inline int64_t partition(std::vector<double> &a, int64_t lo, int64_t hi) {
    std::uniform_int_distribution<int64_t> dist(lo, hi);
    int64_t pivotIdx = dist(quicksortRng());
    std::swap(a[pivotIdx], a[hi]);
    double pivot = a[hi];

    int64_t i = lo - 1;
    for (int64_t j = lo; j < hi; j++) {
        if (a[j] <= pivot) {
            i++;
            std::swap(a[i], a[j]);
        }
    }
    std::swap(a[i + 1], a[hi]);
    return i + 1;
}

} // namespace detail

inline void quickSort(std::vector<double> &a) {
    if (a.empty()) return;

    int64_t lo = 0, hi = static_cast<int64_t>(a.size()) - 1;

    // Ngan xep thu cong de xu ly de quy "duoi" (tail) ma khong lam tran ngan xep
    std::vector<std::pair<int64_t, int64_t>> stack;
    stack.push_back({lo, hi});

    while (!stack.empty()) {
        auto [l, h] = stack.back();
        stack.pop_back();

        while (l < h) {
            int64_t p = detail::partition(a, l, h);

            // De quy (qua ngan xep) vao phan nho hon, lap tiep voi phan lon hon
            if (p - l < h - p) {
                if (l < p - 1) stack.push_back({l, p - 1});
                l = p + 1;
            } else {
                if (p + 1 < h) stack.push_back({p + 1, h});
                h = p - 1;
            }
        }
    }
}

// ============================= HEAPSORT ===============================
// Xay dung max-heap roi lan luot dua phan tu lon nhat ve cuoi mang.

namespace detail {

inline void siftDown(std::vector<double> &a, int64_t n, int64_t i) {
    while (true) {
        int64_t largest = i;
        int64_t l = 2 * i + 1;
        int64_t r = 2 * i + 2;

        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;

        if (largest == i) break;

        std::swap(a[i], a[largest]);
        i = largest;
    }
}

} // namespace detail

inline void heapSort(std::vector<double> &a) {
    int64_t n = static_cast<int64_t>(a.size());
    if (n < 2) return;

    // Xay dung max-heap
    for (int64_t i = n / 2 - 1; i >= 0; i--) {
        detail::siftDown(a, n, i);
    }

    // Lien tuc lay phan tu lon nhat (dinh heap) dua ve cuoi
    for (int64_t i = n - 1; i > 0; i--) {
        std::swap(a[0], a[i]);
        detail::siftDown(a, i, 0);
    }
}

// ============================= MERGESORT ===============================
// Merge sort "top-down", dung 1 bo dem phu (buffer) duy nhat de giam
// chi phi cap phat bo nho.

namespace detail {

inline void merge(std::vector<double> &a, std::vector<double> &buf,
                   int64_t lo, int64_t mid, int64_t hi) {
    int64_t i = lo, j = mid + 1, k = lo;

    while (i <= mid && j <= hi) {
        if (a[i] <= a[j]) buf[k++] = a[i++];
        else buf[k++] = a[j++];
    }
    while (i <= mid) buf[k++] = a[i++];
    while (j <= hi) buf[k++] = a[j++];

    for (int64_t x = lo; x <= hi; x++) a[x] = buf[x];
}

inline void mergeSortRec(std::vector<double> &a, std::vector<double> &buf,
                          int64_t lo, int64_t hi) {
    if (lo >= hi) return;
    int64_t mid = lo + (hi - lo) / 2;
    mergeSortRec(a, buf, lo, mid);
    mergeSortRec(a, buf, mid + 1, hi);
    merge(a, buf, lo, mid, hi);
}

} // namespace detail

inline void mergeSort(std::vector<double> &a) {
    if (a.size() < 2) return;
    std::vector<double> buf(a.size());
    detail::mergeSortRec(a, buf, 0, static_cast<int64_t>(a.size()) - 1);
}

// ============================= STD::SORT ===============================
// Dung ham sort co san cua C++ (introsort: quicksort + heapsort + insertion
// sort) de doi chieu voi 3 thuat toan tu cai dat o tren.

inline void stdSort(std::vector<double> &a) {
    std::sort(a.begin(), a.end());
}

#endif // SORT_ALGORITHMS_HPP
