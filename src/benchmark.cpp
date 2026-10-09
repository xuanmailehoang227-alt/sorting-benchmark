// benchmark.cpp
// Doc 10 bo du lieu da sinh, chay 4 thuat toan sap xep
// (QuickSort, HeapSort, MergeSort, std::sort), do thoi gian thuc thi
// (chi tinh thoi gian sap xep, khong tinh thoi gian doc file),
// kiem tra ket qua da sap xep dung, va ghi ket qua ra results/results.csv

#include <chrono>
#include <cstdint>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

#include "sort_algorithms.hpp"

std::vector<double> loadBinary(const std::string &path) {
    std::ifstream in(path, std::ios::binary);
    if (!in) {
        std::cerr << "Khong mo duoc file: " << path << "\n";
        exit(1);
    }
    int64_t n = 0;
    in.read(reinterpret_cast<char *>(&n), sizeof(n));
    std::vector<double> v(n);
    in.read(reinterpret_cast<char *>(v.data()), n * sizeof(double));
    return v;
}

// Chay va do thoi gian 1 thuat toan sap xep, tra ve thoi gian theo ms.
// Nhan ban sao du lieu goc de khong lam anh huong cac lan chay sau.
template <typename SortFunc>
double timeSort(const std::vector<double> &original, SortFunc sortFunc) {
    std::vector<double> v = original; // sao chep de moi thuat toan nhan cung du lieu goc

    auto t0 = std::chrono::high_resolution_clock::now();
    sortFunc(v);
    auto t1 = std::chrono::high_resolution_clock::now();

    if (!std::is_sorted(v.begin(), v.end())) {
        std::cerr << "LOI: ket qua sap xep KHONG dung!\n";
        exit(1);
    }

    std::chrono::duration<double, std::milli> ms = t1 - t0;
    return ms.count();
}

int main() {
    const int NUM_DATASETS = 10;

    std::ofstream csv("results/results.csv");
    csv << "Dataset,QuickSort_ms,HeapSort_ms,MergeSort_ms,StdSort_ms\n";

    double sumQ = 0, sumH = 0, sumM = 0, sumS = 0;

    std::cout << std::fixed << std::setprecision(2);
    std::cout << "Dataset\tQuickSort\tHeapSort\tMergeSort\tStdSort\n";

    for (int d = 1; d <= NUM_DATASETS; d++) {
        char fname[64];
        snprintf(fname, sizeof(fname), "data/seq%02d.bin", d);
        std::vector<double> original = loadBinary(fname);

        double tQ = timeSort(original, quickSort);
        double tH = timeSort(original, heapSort);
        double tM = timeSort(original, mergeSort);
        double tS = timeSort(original, stdSort);

        sumQ += tQ; sumH += tH; sumM += tM; sumS += tS;

        std::cout << d << "\t" << tQ << "\t\t" << tH << "\t\t" << tM << "\t\t" << tS << "\n";
        csv << d << "," << tQ << "," << tH << "," << tM << "," << tS << "\n";
    }

    double avgQ = sumQ / NUM_DATASETS;
    double avgH = sumH / NUM_DATASETS;
    double avgM = sumM / NUM_DATASETS;
    double avgS = sumS / NUM_DATASETS;

    std::cout << "TB\t" << avgQ << "\t\t" << avgH << "\t\t" << avgM << "\t\t" << avgS << "\n";
    csv << "Trung binh," << avgQ << "," << avgH << "," << avgM << "," << avgS << "\n";

    csv.close();
    std::cout << "\nDa ghi ket qua vao results/results.csv\n";

    return 0;
}
