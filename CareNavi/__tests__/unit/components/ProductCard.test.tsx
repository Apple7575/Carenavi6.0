// T079: Unit test for ProductCard
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductCard from '../../../src/components/store/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Vitamin C',
  description: 'Daily vitamin supplement',
  category: 'supplements' as const,
  price: 29000,
  image_url: null,
  condition_keywords: ['immunity', 'fatigue'],
  is_active: true,
  created_at: '2024-01-01',
};

describe('ProductCard', () => {
  it('renders product name', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onPress={jest.fn()} />
    );
    expect(getByText('Vitamin C')).toBeTruthy();
  });

  it('renders product price', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onPress={jest.fn()} />
    );
    expect(getByText('29,000원')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ProductCard product={mockProduct} onPress={onPress} testID="product-card" />
    );

    fireEvent.press(getByTestId('product-card'));
    expect(onPress).toHaveBeenCalledWith(mockProduct);
  });
});
