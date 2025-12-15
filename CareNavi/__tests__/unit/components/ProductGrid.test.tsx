// T080: Unit test for ProductGrid
import React from 'react';
import { render } from '@testing-library/react-native';
import ProductGrid from '../../../src/components/store/ProductGrid';

const mockProducts = [
  {
    id: '1',
    name: 'Vitamin C',
    description: 'Daily vitamin',
    category: 'supplements' as const,
    price: 29000,
    image_url: null,
    condition_keywords: ['immunity'],
    is_active: true,
    created_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'Omega-3',
    description: 'Fish oil supplement',
    category: 'supplements' as const,
    price: 35000,
    image_url: null,
    condition_keywords: ['heart'],
    is_active: true,
    created_at: '2024-01-01',
  },
];

describe('ProductGrid', () => {
  it('renders products', () => {
    const { getByText } = render(
      <ProductGrid products={mockProducts} onProductPress={jest.fn()} />
    );
    expect(getByText('Vitamin C')).toBeTruthy();
    expect(getByText('Omega-3')).toBeTruthy();
  });

  it('renders empty message when no products', () => {
    const { getByText } = render(
      <ProductGrid products={[]} onProductPress={jest.fn()} />
    );
    expect(getByText('상품이 없습니다')).toBeTruthy();
  });

  it('renders loading state', () => {
    const { getByText } = render(
      <ProductGrid products={[]} onProductPress={jest.fn()} loading={true} />
    );
    expect(getByText('로딩 중...')).toBeTruthy();
  });
});
