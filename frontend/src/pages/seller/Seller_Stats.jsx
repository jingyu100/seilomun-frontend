import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import Seller_Header from "../../components/seller/Seller_Header.jsx";
import "../../css/seller/Seller_stats.css";

// Chart.js 전역 등록
Chart.register(...registerables);

const Seller_Stats = () => {
    const [currentViewMode, setCurrentViewMode] = useState('monthly');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [statsData, setStatsData] = useState([]);
    const [showStats, setShowStats] = useState(false);

    const salesChartRef = useRef(null);
    const orderChartRef = useRef(null);
    const salesChartInstance = useRef(null);
    const orderChartInstance = useRef(null);

    // 연도 옵션 생성
    const yearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear - 4; year <= currentYear + 1; year++) {
            years.push(year);
        }
        return years;
    };

    // 월 옵션
    const monthOptions = [
        { value: '1', label: '1월' },
        { value: '2', label: '2월' },
        { value: '3', label: '3월' },
        { value: '4', label: '4월' },
        { value: '5', label: '5월' },
        { value: '6', label: '6월' },
        { value: '7', label: '7월' },
        { value: '8', label: '8월' },
        { value: '9', label: '9월' },
        { value: '10', label: '10월' },
        { value: '11', label: '11월' },
        { value: '12', label: '12월' }
    ];

    // 백엔드 데이터를 프론트엔드 형식으로 변환
    const transformBackendData = (backendData) => {
        if (!backendData || !Array.isArray(backendData)) {
            return [];
        }

        return backendData.map(item => {
            const year = item.year;
            const month = item.month;
            const day = item.day;
            const week = item.week;
            const quarter = item.quarter;
            const totalOrders = item.count;
            const totalSales = item.totalAmount;

            let period = '';

            switch (currentViewMode) {
                case 'daily':
                    period = `${month}/${day}`;
                    break;
                case 'weekly':
                    period = `${week}주차`;
                    break;
                case 'monthly':
                    period = `${month}월`;
                    break;
                case 'quarterly':
                    period = `${quarter}분기`;
                    break;
                case 'yearly':
                    period = `${year}년`;
                    break;
                default:
                    period = `${month}월`;
            }

            return {
                period: period,
                year: year,
                month: month,
                day: day,
                week: week,
                quarter: quarter,
                totalSales: totalSales || 0,
                totalOrders: totalOrders || 0
            };
        });
    };

    // 통계 데이터 로드
    const loadStats = async () => {
        setLoading(true);
        setError(false);
        setShowStats(false);

        try {
            let url = 'http://3.36.70.70/api/orders/stats';
            const params = new URLSearchParams();

            // period 파라미터 추가
            params.append('period', currentViewMode);

            // 연도 파라미터
            if (selectedYear && selectedYear !== '') {
                params.append('year', selectedYear.toString());
            }

            // 월 파라미터 (일별, 월별일 때만)
            if (selectedMonth && selectedMonth !== '' &&
                (currentViewMode === 'daily' || currentViewMode === 'monthly')) {
                params.append('month', selectedMonth);
            }

            url += '?' + params.toString();
            console.log('API 호출 URL:', url);

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('인증이 실패했습니다. 다시 로그인해주세요.');
                }
                if (response.status === 403) {
                    throw new Error('접근 권한이 없습니다.');
                }
                throw new Error(`서버 오류: ${response.status}`);
            }

            const result = await response.json();
            console.log('백엔드 응답:', result);

            const backendData = result.data ? result.data['통계 조회'] : result['통계 조회'] || result;
            const transformedData = transformBackendData(backendData);
            console.log('변환된 데이터:', transformedData);

            setStatsData(transformedData);
            setLoading(false);
            setShowStats(true);
        } catch (error) {
            console.error('통계 데이터 로드 오류:', error);
            setLoading(false);
            setError(true);
            setShowStats(false);
        }
    };

    // 뷰 모드 변경
    const handleViewModeChange = (mode) => {
        setCurrentViewMode(mode);

        // 일별이 아닌 경우 월 선택 초기화
        if (mode !== 'daily' && mode !== 'monthly') {
            setSelectedMonth('');
        }

        // 자동으로 데이터 다시 로드
        setTimeout(() => {
            loadStats();
        }, 100);
    };

    // 차트 렌더링
    const renderCharts = () => {
        if (!statsData.length) return;

        // 기존 차트 제거
        if (salesChartInstance.current) {
            salesChartInstance.current.destroy();
        }
        if (orderChartInstance.current) {
            orderChartInstance.current.destroy();
        }

        const periods = statsData.map(item => item.period);
        const sales = statsData.map(item => item.totalSales || 0);
        const orders = statsData.map(item => item.totalOrders || 0);

        // 색상 설정 (기간별로 다른 색상)
        const colorMap = {
            daily: { sales: '#ef4444', orders: '#f97316' },
            weekly: { sales: '#8b5cf6', orders: '#a855f7' },
            monthly: { sales: '#4f46e5', orders: '#7c3aed' },
            quarterly: { sales: '#059669', orders: '#10b981' },
            yearly: { sales: '#dc2626', orders: '#f59e0b' }
        };

        const colors = colorMap[currentViewMode] || colorMap.monthly;

        // 차트 타입 결정
        const chartType = currentViewMode === 'daily' ? 'line' : 'bar';

        // 매출 차트
        if (salesChartRef.current) {
            const salesCtx = salesChartRef.current.getContext('2d');
            salesChartInstance.current = new Chart(salesCtx, {
                type: chartType,
                data: {
                    labels: periods,
                    datasets: [{
                        label: '매출 (원)',
                        data: sales,
                        borderColor: colors.sales,
                        backgroundColor: chartType === 'line'
                            ? colors.sales + '20'
                            : colors.sales + 'CC',
                        borderWidth: 3,
                        fill: chartType === 'line',
                        tension: 0.4,
                        pointBackgroundColor: colors.sales,
                        pointBorderColor: 'white',
                        pointBorderWidth: 2,
                        pointRadius: chartType === 'line' ? 6 : 0,
                        pointHoverRadius: chartType === 'line' ? 8 : 0,
                        borderRadius: chartType === 'bar' ? 8 : 0,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return formatCurrency(value);
                                }
                            }
                        }
                    }
                }
            });
        }

        // 주문 차트
        if (orderChartRef.current) {
            const orderCtx = orderChartRef.current.getContext('2d');
            orderChartInstance.current = new Chart(orderCtx, {
                type: 'bar',
                data: {
                    labels: periods,
                    datasets: [{
                        label: '주문 수',
                        data: orders,
                        backgroundColor: colors.orders + 'DD',
                        borderColor: colors.orders,
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + '건';
                                }
                            }
                        }
                    }
                }
            });
        }
    };

    // 통화 포맷팅
    const formatCurrency = (amount) => {
        if (amount >= 100000000) {
            return (amount / 100000000).toFixed(1) + '억원';
        } else if (amount >= 10000) {
            return (amount / 10000).toFixed(0) + '만원';
        }
        return amount.toLocaleString() + '원';
    };

    // 요약 정보 계산
    const getSummaryData = () => {
        if (!statsData.length) return { totalSales: 0, totalOrders: 0, avgOrderValue: 0 };

        const totalSales = statsData.reduce((sum, item) => sum + (item.totalSales || 0), 0);
        const totalOrders = statsData.reduce((sum, item) => sum + (item.totalOrders || 0), 0);
        const avgOrderValue = totalOrders > 0 ? Math.floor(totalSales / totalOrders) : 0;

        return { totalSales, totalOrders, avgOrderValue };
    };

    // 기간 정보 텍스트
    const getPeriodText = () => {
        const periodNames = {
            daily: '일별',
            weekly: '주간별',
            monthly: '월별',
            quarterly: '분기별',
            yearly: '연도별'
        };

        let baseText = periodNames[currentViewMode] || '월별';

        if (currentViewMode === 'daily' && selectedYear && selectedMonth) {
            return `${selectedYear}년 ${selectedMonth}월 ${baseText}`;
        } else if ((currentViewMode === 'monthly' || currentViewMode === 'weekly' ||
            currentViewMode === 'quarterly') && selectedYear) {
            return `${selectedYear}년 ${baseText}`;
        } else if (currentViewMode === 'yearly') {
            return baseText;
        } else if (selectedYear) {
            return `${selectedYear}년 ${baseText}`;
        } else {
            return `전체 ${baseText}`;
        }
    };

    // 월 선택이 필요한 뷰모드인지 확인
    const shouldShowMonthSelector = () => {
        return currentViewMode === 'daily' || currentViewMode === 'monthly';
    };

    // 초기 로드
    useEffect(() => {
        loadStats();
    }, []);

    // 데이터 변경 시 차트 업데이트
    useEffect(() => {
        if (showStats && statsData.length > 0) {
            renderCharts();
        }
    }, [showStats, statsData, currentViewMode]);

    // 컴포넌트 언마운트 시 차트 정리
    useEffect(() => {
        return () => {
            if (salesChartInstance.current) {
                salesChartInstance.current.destroy();
            }
            if (orderChartInstance.current) {
                orderChartInstance.current.destroy();
            }
        };
    }, []);

    const summaryData = getSummaryData();

    return (
        <div>
            {/* Seller Header */}
            <Seller_Header />

            {/* 메인 통계 컨텐츠 */}
            <div className="seller-stats">
                <div className="stats-container">
                    {/* Header */}
                    <div className="stats-header">
                        <h1 className="stats-title"> 판매자 통계</h1>
                        <p className="stats-subtitle">매출 및 주문 현황을 다양한 기간별로 확인하세요</p>
                    </div>

                    {/* Controls */}
                    <div className="stats-controls">
                        {/* View Toggle */}
                        <div className="view-toggle">
                            <button
                                onClick={() => handleViewModeChange('daily')}
                                className={`toggle-btn ${currentViewMode === 'daily' ? 'active daily' : ''}`}
                            >
                                📅 일별 보기
                            </button>
                            <button
                                onClick={() => handleViewModeChange('weekly')}
                                className={`toggle-btn ${currentViewMode === 'weekly' ? 'active weekly' : ''}`}
                            >
                                📈 주간별 보기
                            </button>
                            <button
                                onClick={() => handleViewModeChange('monthly')}
                                className={`toggle-btn ${currentViewMode === 'monthly' ? 'active monthly' : ''}`}
                            >
                                📊 월별 보기
                            </button>
                            <button
                                onClick={() => handleViewModeChange('quarterly')}
                                className={`toggle-btn ${currentViewMode === 'quarterly' ? 'active quarterly' : ''}`}
                            >
                                📋 분기별 보기
                            </button>
                            <button
                                onClick={() => handleViewModeChange('yearly')}
                                className={`toggle-btn ${currentViewMode === 'yearly' ? 'active yearly' : ''}`}
                            >
                                🎯 연도별 보기
                            </button>
                        </div>

                        {/* Filter Controls */}
                        <div className="filter-controls">
                            <div className="filter-group">
                                <label className="filter-label">연도</label>
                                <select
                                    value={selectedYear || ''}
                                    onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : '')}
                                    className="filter-select"
                                >
                                    <option value="">전체</option>
                                    {yearOptions().map(year => (
                                        <option key={year} value={year}>{year}년</option>
                                    ))}
                                </select>
                            </div>

                            {shouldShowMonthSelector() && (
                                <div className="filter-group">
                                    <label className="filter-label">월</label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="">전체</option>
                                        {monthOptions.map(month => (
                                            <option key={month.value} value={month.value}>{month.label}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button
                                onClick={loadStats}
                                disabled={loading}
                                className="load-stats-btn"
                            >
                                {loading ? '📊 로딩중...' : '📊 통계 조회'}
                            </button>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="loading-section">
                            <p>📊 데이터를 불러오는 중...</p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="error-section">
                            <div className="error-box">
                                <p>❌ 데이터를 불러오는 중 오류가 발생했습니다.</p>
                                <p className="error-detail">백엔드 서버 연결을 확인해주세요.</p>
                            </div>
                        </div>
                    )}

                    {/* No Data */}
                    {showStats && statsData.length === 0 && (
                        <div className="no-data-section">
                            <div className="no-data-box">
                                <p className="no-data-title">📊 해당 조건의 판매 데이터가 없습니다.</p>
                                <p className="no-data-detail">다른 기간을 선택해보세요.</p>
                            </div>
                        </div>
                    )}

                    {/* Stats Content */}
                    {showStats && statsData.length > 0 && (
                        <>
                            {/* Period Info */}
                            <div className="period-info">
                                <div className="period-box">
                                    <h4 className="period-title">{getPeriodText()} 조회</h4>
                                    <span className="period-count">총 {statsData.length}개 데이터</span>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="summary-section">
                                <div className="summary-cards">
                                    <div className="summary-card">
                                        <h3 className="card-title"> 총 매출</h3>
                                        <p className="card-value">{formatCurrency(summaryData.totalSales)}</p>
                                        <div className="card-subtitle">{getPeriodText()}</div>
                                    </div>

                                    <div className="summary-card">
                                        <h3 className="card-title"> 총 주문수</h3>
                                        <p className="card-value">{summaryData.totalOrders.toLocaleString()}건</p>
                                        <div className="card-subtitle">{getPeriodText()}</div>
                                    </div>

                                    <div className="summary-card">
                                        <h3 className="card-title"> 평균 주문금액</h3>
                                        <p className="card-value">{formatCurrency(summaryData.avgOrderValue)}</p>
                                        <div className="card-subtitle">주문당 평균</div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="charts-section">
                                <div className="chart-container">
                                    <div className="chart-title"> {getPeriodText()} 매출 현황</div>
                                    <div className="chart-wrapper">
                                        <canvas ref={salesChartRef}></canvas>
                                    </div>
                                </div>

                                <div className="chart-container">
                                    <div className="chart-title"> {getPeriodText()} 주문 현황</div>
                                    <div className="chart-wrapper">
                                        <canvas ref={orderChartRef}></canvas>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Seller_Stats;