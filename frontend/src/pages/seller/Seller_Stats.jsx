import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

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
            let url = 'http://localhost/api/orders/stats';
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
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 p-5">
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center">
                    <h1 className="text-4xl font-bold mb-3">📊 판매자 통계 대시보드</h1>
                    <p className="text-lg opacity-90">매출 및 주문 현황을 다양한 기간별로 확인하세요</p>
                </div>

                {/* Controls */}
                <div className="p-8 bg-slate-50 border-b border-slate-200">
                    {/* View Toggle */}
                    <div className="flex flex-wrap justify-center gap-3 mb-6">
                        <button
                            onClick={() => handleViewModeChange('daily')}
                            className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                                currentViewMode === 'daily'
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-red-300'
                            }`}
                        >
                            📅 일별 보기
                        </button>
                        <button
                            onClick={() => handleViewModeChange('weekly')}
                            className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                                currentViewMode === 'weekly'
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-purple-300'
                            }`}
                        >
                            📈 주간별 보기
                        </button>
                        <button
                            onClick={() => handleViewModeChange('monthly')}
                            className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                                currentViewMode === 'monthly'
                                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-indigo-300'
                            }`}
                        >
                            📊 월별 보기
                        </button>
                        <button
                            onClick={() => handleViewModeChange('quarterly')}
                            className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                                currentViewMode === 'quarterly'
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-green-300'
                            }`}
                        >
                            📋 분기별 보기
                        </button>
                        <button
                            onClick={() => handleViewModeChange('yearly')}
                            className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                                currentViewMode === 'yearly'
                                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-orange-300'
                            }`}
                        >
                            🎯 연도별 보기
                        </button>
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap justify-center items-center gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700 text-sm">연도</label>
                            <select
                                value={selectedYear || ''}
                                onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : '')}
                                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors min-w-36"
                            >
                                <option value="">전체</option>
                                {yearOptions().map(year => (
                                    <option key={year} value={year}>{year}년</option>
                                ))}
                            </select>
                        </div>

                        {shouldShowMonthSelector() && (
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700 text-sm">월</label>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors min-w-36"
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
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '📊 로딩중...' : '📊 통계 조회'}
                        </button>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12 text-gray-600 text-lg">
                        <p>📊 데이터를 불러오는 중...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-center py-8 mx-5">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">
                            <p>❌ 데이터를 불러오는 중 오류가 발생했습니다.</p>
                            <p className="text-sm mt-2">백엔드 서버 연결을 확인해주세요.</p>
                        </div>
                    </div>
                )}

                {/* No Data */}
                {showStats && statsData.length === 0 && (
                    <div className="text-center py-12 mx-5">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-gray-600">
                            <p className="text-lg mb-2">📊 해당 조건의 판매 데이터가 없습니다.</p>
                            <p className="text-sm">다른 기간을 선택해보세요.</p>
                        </div>
                    </div>
                )}

                {/* Stats Content */}
                {showStats && statsData.length > 0 && (
                    <>
                        {/* Period Info */}
                        <div className="px-8 pt-5">
                            <div className="flex justify-between items-center mb-5 p-4 bg-slate-100 rounded-xl border-l-4 border-indigo-500">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    {getPeriodText()} 조회
                                </h4>
                                <span className="text-gray-600 text-sm">총 {statsData.length}개 데이터</span>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="px-8 pb-8 bg-slate-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">💰 총 매출</h3>
                                    <p className="text-3xl font-bold text-gray-800 mb-2">{formatCurrency(summaryData.totalSales)}</p>
                                    <div className="text-sm text-gray-500">{getPeriodText()}</div>
                                </div>

                                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">📦 총 주문수</h3>
                                    <p className="text-3xl font-bold text-gray-800 mb-2">{summaryData.totalOrders.toLocaleString()}건</p>
                                    <div className="text-sm text-gray-500">{getPeriodText()}</div>
                                </div>

                                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">💳 평균 주문금액</h3>
                                    <p className="text-3xl font-bold text-gray-800 mb-2">{formatCurrency(summaryData.avgOrderValue)}</p>
                                    <div className="text-sm text-gray-500">주문당 평균</div>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="text-xl font-bold text-gray-800 mb-5 text-center pb-4 border-b-2 border-gray-100">
                                    💰 {getPeriodText()} 매출 현황
                                </div>
                                <div className="relative h-80">
                                    <canvas ref={salesChartRef}></canvas>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="text-xl font-bold text-gray-800 mb-5 text-center pb-4 border-b-2 border-gray-100">
                                    📦 {getPeriodText()} 주문 현황
                                </div>
                                <div className="relative h-80">
                                    <canvas ref={orderChartRef}></canvas>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Seller_Stats;