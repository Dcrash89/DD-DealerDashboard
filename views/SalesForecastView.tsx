
import React, { useState, useMemo } from 'react';
import { UserRole, SalesForecast, Dealer, Product } from '../types';
import { Icon } from '../components/ui/Icon';
import ProgressBar from '../components/ui/ProgressBar';
import { Dropdown } from '../components/ui/Dropdown';
import AddForecastModal from '../components/forecasts/AddForecastModal';
import UpdateActualsModal from '../components/forecasts/UpdateActualsModal';


interface SalesForecastViewProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
  userRole: UserRole;
  forecasts: SalesForecast[];
  dealers: Dealer[];
  products: Product[];
  currentDealerId: string;
  onAdd: (data: Omit<SalesForecast, 'id' | 'dealerName' | 'productName' | 'actualUnits' | 'status'>) => void;
  onUpdate: (id: string, data: Partial<Omit<SalesForecast, 'id'>>) => void;
  onDelete: (id: string) => void;
  onUpdateActuals: (id: string, actualUnits: number) => void;
}

const SalesForecastView: React.FC<SalesForecastViewProps> = ({ t, userRole, forecasts, dealers, products, currentDealerId, onAdd, onUpdate, onDelete, onUpdateActuals }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingForecast, setEditingForecast] = useState<SalesForecast | null>(null);

  // Filters
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterQuarter, setFilterQuarter] = useState<string>('all');
  const [filterDealer, setFilterDealer] = useState<string>('all');
  const [filterProduct, setFilterProduct] = useState<string>('all');
  
  const years = useMemo(() => ['all', ...Array.from(new Set(forecasts.map(f => f.year.toString()))).sort()], [forecasts]);
  const quarters = ['all', '1', '2', '3', '4'];
  const productOptions = [{value: 'all', label: t('allProducts')}, ...products.map(p => ({ value: p.id, label: p.name }))];
  const dealerOptions = [{value: 'all', label: t('allDealers')}, ...dealers.map(d => ({ value: d.id, label: d.name }))];

  const filteredForecasts = useMemo(() => {
    let data = userRole === UserRole.DEALER ? forecasts.filter(f => f.dealerId === currentDealerId) : forecasts;
    
    if (userRole === UserRole.ADMIN && filterDealer !== 'all') {
        data = data.filter(f => f.dealerId === filterDealer);
    }
    if (filterYear !== 'all') {
        data = data.filter(f => f.year.toString() === filterYear);
    }
    if (filterQuarter !== 'all') {
        data = data.filter(f => f.quarter.toString() === filterQuarter);
    }
    if (filterProduct !== 'all') {
        data = data.filter(f => f.productId === filterProduct);
    }

    return data;
  }, [forecasts, userRole, currentDealerId, filterYear, filterQuarter, filterDealer, filterProduct]);
  
  const handleOpenAdd = () => {
    setEditingForecast(null);
    setIsAddModalOpen(true);
  };
  
  const handleOpenEdit = (forecast: SalesForecast) => {
    setEditingForecast(forecast);
    setIsAddModalOpen(true);
  };
  
  const handleOpenUpdateActuals = (forecast: SalesForecast) => {
    setEditingForecast(forecast);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDeleteForecastMessage'))) {
        onDelete(id);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('salesForecasts')}</h2>
        {userRole === UserRole.ADMIN && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center bg-dji-blue hover:bg-dji-blue-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
            >
              <Icon name="plus" className="w-5 h-5 mr-2" />
              {t('addForecast')}
            </button>
        )}
      </div>
      
      {/* Filters Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-6">
        <Dropdown options={years.map(y => ({value: y, label: y === 'all' ? t('allYears') : y}))} selectedValue={filterYear} onSelect={setFilterYear} />
        <Dropdown options={quarters.map(q => ({value: q, label: q === 'all' ? t('allQuarters') : t('Q{q}', {q})}))} selectedValue={filterQuarter} onSelect={setFilterQuarter} />
        <Dropdown options={productOptions} selectedValue={filterProduct} onSelect={setFilterProduct} />
        {userRole === UserRole.ADMIN && <Dropdown options={dealerOptions} selectedValue={filterDealer} onSelect={setFilterDealer} />}
      </div>
      
      {/* Table */}
       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {userRole === UserRole.ADMIN && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('dealer')}</th>}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('product')}</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('year')}</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('quarter')}</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('forecastedUnits')}</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actualUnits')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('achievement')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('status')}</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredForecasts.length > 0 ? filteredForecasts.map((fc) => {
                const achievement = fc.forecastedUnits > 0 ? (fc.actualUnits / fc.forecastedUnits) * 100 : 0;
                return (
                    <tr key={fc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                        {userRole === UserRole.ADMIN && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{fc.dealerName}</td>}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{fc.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">{fc.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">{t('Q{q}', {q: fc.quarter})}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-800 dark:text-gray-200">{fc.forecastedUnits}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-dji-blue">{fc.actualUnits}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[120px]"><ProgressBar value={achievement}/></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${fc.status === 'Open' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>{t(fc.status)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {userRole === UserRole.ADMIN && <>
                                <button onClick={() => handleOpenEdit(fc)} className="text-dji-blue hover:text-dji-blue-dark p-2 rounded-full hover:bg-dji-blue/10" title={t('editForecast')}><Icon name="edit" className="w-5 h-5"/></button>
                                <button onClick={() => handleDelete(fc.id)} className="text-red-600 hover:text-red-800 ml-2 p-2 rounded-full hover:bg-red-500/10" title={t('delete')
                                }><Icon name="trash" className="w-5 h-5"/></button>
                            </>}
                            {userRole === UserRole.DEALER && fc.status === 'Open' && (
                                <button onClick={() => handleOpenUpdateActuals(fc)} className="text-dji-blue hover:text-dji-blue-dark p-2 rounded-full hover:bg-dji-blue/10" title={t('updateActuals')}><Icon name="edit" className="w-5 h-5"/></button>
                            )}
                        </td>
                    </tr>
                )
              }) : (
                <tr>
                    <td colSpan={userRole === UserRole.ADMIN ? 9 : 8} className="text-center py-10 text-gray-500 dark:text-gray-400">{t('noForecastsFound')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <AddForecastModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={onAdd}
        onUpdate={onUpdate}
        t={t}
        forecastToEdit={editingForecast}
        dealers={dealers}
        products={products}
      />
      
      <UpdateActualsModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSave={onUpdateActuals}
        t={t}
        forecastToEdit={editingForecast}
      />
    </>
  );
};

export default SalesForecastView;
