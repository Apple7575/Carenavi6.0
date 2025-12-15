// T085: Store Screen - Product browsing with grid, search, filters
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import SearchBar from '../components/store/SearchBar';
import CategoryFilter from '../components/store/CategoryFilter';
import ProductGrid from '../components/store/ProductGrid';
import ProductDetailModal from '../components/store/ProductDetailModal';
import { useProductStore } from '../stores/useProductStore';
import { Product } from '../types';

export default function StoreScreen() {
  const {
    products,
    selectedCategory,
    searchQuery,
    isLoading,
    selectedProduct,
    setSelectedCategory,
    setSearchQuery,
    fetchProducts,
    setSelectedProduct,
    getFilteredProducts,
  } = useProductStore();

  const [showDetail, setShowDetail] = useState(false);

  // Fetch products on mount and when category changes
  useEffect(() => {
    fetchProducts({ category: selectedCategory ?? undefined });
  }, [selectedCategory, fetchProducts]);

  const handleProductPress = useCallback(
    (product: Product) => {
      setSelectedProduct(product);
      setShowDetail(true);
    },
    [setSelectedProduct]
  );

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
    setSelectedProduct(null);
  }, [setSelectedProduct]);

  const filteredProducts = getFilteredProducts();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>스토어</Text>
        <Text style={styles.headerSubtitle}>건강 상품 둘러보기</Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="상품 검색"
      />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ProductGrid
        products={filteredProducts}
        onProductPress={handleProductPress}
        loading={isLoading}
      />

      <ProductDetailModal
        product={selectedProduct}
        visible={showDetail}
        onClose={handleCloseDetail}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
