import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PlanMapDiscovery from '../../src/components/plan/PlanMapDiscovery';

const mockPlaces = [
  {
    id: 'dn-01',
    name: 'Cầu Rồng Đà Nẵng',
    city: 'Đà Nẵng',
    lat: 16.0610,
    lng: 108.2272,
    category: 'landmark',
    categoryName: 'Di tích & Biểu tượng',
    rating: 4.8,
    address: 'Nguyễn Văn Linh, Hải Châu',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b',
  },
  {
    id: 'dn-02',
    name: 'Bãi Biển Mỹ Khê',
    city: 'Đà Nẵng',
    lat: 16.0595,
    lng: 108.2464,
    category: 'beach',
    categoryName: 'Biển & Nghỉ dưỡng',
    rating: 4.7,
    address: 'Võ Nguyên Giáp, Sơn Trà',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  },
  {
    id: 'dn-03',
    name: 'Bánh Xèo Bà Dưỡng',
    city: 'Đà Nẵng',
    lat: 16.0592,
    lng: 108.2140,
    category: 'food',
    categoryName: 'Ẩm thực địa phương',
    rating: 4.6,
    address: 'K280/23 Hoàng Diệu, Hải Châu',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
  },
];

describe('Component Test: PlanMapDiscovery (Interactive Map, Search & AI Plan Button)', () => {
  it('RED-FE-MAP-01: renders search bar, city chips, and category filter chips', () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Floating Search bar
    expect(getByPlaceholderText(/Tìm kiếm địa điểm, quán ăn.../i)).toBeTruthy();

    // City chips
    expect(getAllByText(/Đà Nẵng/i).length).toBeGreaterThan(0);
    expect(getByText(/Tokyo/i)).toBeTruthy();

    // Category filter tabs
    expect(getByText('Tất cả')).toBeTruthy();
    expect(getByText('Di tích')).toBeTruthy();
    expect(getByText('Biển')).toBeTruthy();
    expect(getByText('Ẩm thực')).toBeTruthy();
  });

  it('RED-FE-MAP-02: filters places by search query and category', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Initial state: shows all
    expect(getByText('Cầu Rồng Đà Nẵng')).toBeTruthy();
    expect(getByText('Bãi Biển Mỹ Khê')).toBeTruthy();
    expect(getByText('Bánh Xèo Bà Dưỡng')).toBeTruthy();

    // Search query filter
    const searchInput = getByPlaceholderText(/Tìm kiếm địa điểm, quán ăn.../i);
    fireEvent.changeText(searchInput, 'Cầu Rồng');

    expect(getByText('Cầu Rồng Đà Nẵng')).toBeTruthy();
    expect(queryByText('Bãi Biển Mỹ Khê')).toBeNull();
    expect(queryByText('Bánh Xèo Bà Dưỡng')).toBeNull();

    // Reset search
    fireEvent.changeText(searchInput, '');

    // Category filter
    fireEvent.press(getByText('Ẩm thực'));
    expect(getByText('Bánh Xèo Bà Dưỡng')).toBeTruthy();
    expect(queryByText('Cầu Rồng Đà Nẵng')).toBeNull();
  });

  it('RED-FE-MAP-03: toggles place selection and updates selected count badge', () => {
    const { getByText, getAllByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={jest.fn()} />
    );

    // Select first place
    const selectButtons = getAllByText(/\+ Chọn|\+ Thêm/i);
    fireEvent.press(selectButtons[0]);

    // Counter badge should show 1 điểm
    expect(getByText(/1 điểm đã chọn/i)).toBeTruthy();

    // Toggle again to deselect
    const selectedBtn = getByText(/✓ Đã chọn/i);
    fireEvent.press(selectedBtn);

    expect(getByText(/0 điểm đã chọn/i)).toBeTruthy();
  });

  it('RED-FE-MAP-04: triggers onGenerateAiPlan callback when tapping AI button with selected places', () => {
    const mockOnGenerate = jest.fn();
    const { getAllByText, getByText } = render(
      <PlanMapDiscovery places={mockPlaces} onGenerateAiPlan={mockOnGenerate} />
    );

    // Select places
    const selectButtons = getAllByText(/\+ Chọn|\+ Thêm/i);
    fireEvent.press(selectButtons[0]);
    fireEvent.press(selectButtons[1]);

    // Press AI plan button
    const aiBtn = getByText(/✨ AI Lên Lịch Trình/i);
    fireEvent.press(aiBtn);

    expect(mockOnGenerate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 'dn-01' }),
        expect.objectContaining({ id: 'dn-02' }),
      ])
    );
  });
});
