import React, { useState, useEffect, useMemo } from 'react';
import { Wallet, Calculator, ArrowRightLeft, ArrowRight, Plus, X, CheckCircle2, Trash2 } from 'lucide-react';
import { Activity, CustomExpense } from '../types';

interface Props {
    itinerary: Activity[];
}

const Budget: React.FC<Props> = ({ itinerary }) => {
    const [currency, setCurrency] = useState<'NOK' | 'EUR'>('NOK');
    const [rate, setRate] = useState(11.8);
    const [calcAmount, setCalcAmount] = useState('');
    const [calcMode, setCalcMode] = useState<'NOK_TO_EUR' | 'EUR_TO_NOK'>('NOK_TO_EUR');
    
    // Toggle completed items for budget
    const [paidItems, setPaidItems] = useState<string[]>([]);

    // Manual Expenses
    const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([]);
    const [newExpName, setNewExpName] = useState('');
    const [newExpCost, setNewExpCost] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Fetch Live Rate
    useEffect(() => {
        fetch('https://api.exchangerate-api.com/v4/latest/EUR')
            .then(res => res.json())
            .then(data => {
                if(data && data.rates && data.rates.NOK) {
                    setRate(data.rates.NOK);
                }
            })
            .catch(err => console.log('Using offline rate'));
    }, []);

    const togglePaid = (id: string) => {
        if (paidItems.includes(id)) {
            setPaidItems(paidItems.filter(i => i !== id));
        } else {
            setPaidItems([...paidItems, id]);
        }
    };

    const addCustomExpense = () => {
        if(!newExpName || !newExpCost) return;
        const cost = parseFloat(newExpCost);
        if(isNaN(cost)) return;

        const newExp: CustomExpense = {
            id: 'cust_' + Date.now(),
            title: newExpName,
            priceNOK: currency === 'NOK' ? cost : cost * rate,
            priceEUR: currency === 'EUR' ? cost : cost / rate,
            type: 'extra'
        };
        
        setCustomExpenses([...customExpenses, newExp]);
        setNewExpName('');
        setNewExpCost('');
        setIsAddOpen(false);
    };
    
    const removeCustomExpense = (id: string) => {
        setCustomExpenses(customExpenses.filter(e => e.id !== id));
    };

    const stats = useMemo(() => {
        const totalEUR_Plan = itinerary.reduce((sum, item) => sum + item.priceEUR, 0);
        const totalEUR_Custom = customExpenses.reduce((sum, item) => sum + item.priceEUR, 0);
        
        const spentEUR_Plan = itinerary
            .filter(item => paidItems.includes(item.id))
            .reduce((sum, item) => sum + item.priceEUR, 0);
        
        const totalEUR = totalEUR_Plan + totalEUR_Custom;
        const currentEUR = spentEUR_Plan + totalEUR_Custom;
        
        return {
            total: currency === 'EUR' ? totalEUR : totalEUR * rate,
            current: currency === 'EUR' ? currentEUR : currentEUR * rate,
            pending: currency === 'EUR' ? (totalEUR - currentEUR) : (totalEUR - currentEUR) * rate
        };
    }, [itinerary, paidItems, currency, rate, customExpenses]);

    const convertedValue = useMemo(() => {
        const val = parseFloat(calcAmount);
        if (isNaN(val)) return '---';
        if (calcMode === 'EUR_TO_NOK') return (val * rate).toFixed(2) + ' kr';
        return (val / rate).toFixed(2) + ' €';
    }, [calcAmount, calcMode, rate]);

    return (
        <div className="pb-24 px-4 pt-6 max-w-lg mx-auto h-full overflow-y-auto">
            {/* Header & Currency Toggle */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-fjord-500 flex items-center">
                    <Wallet className="mr-2" /> Gastos
                </h2>
                <div className="flex bg-slate-200 rounded-lg p-1">
                    <button onClick={() => setCurrency('EUR')} className={`px-3 py-1 text-sm rounded-md font-bold transition-all ${currency === 'EUR' ? 'bg-white shadow text-fjord-600' : 'text-slate-500'}`}>EUR</button>
                    <button onClick={() => setCurrency('NOK')} className={`px-3 py-1 text-sm rounded-md font-bold transition-all ${currency === 'NOK' ? 'bg-white shadow text-fjord-600' : 'text-slate-500'}`}>NOK</button>
                </div>
            </div>

            {/* Converter Tool */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center">
                        <Calculator size={12} className="mr-1"/> Conversor (1€ ≈ {rate.toFixed(2)} kr)
                    </h3>
                    <button onClick={() => setCalcMode(prev => prev === 'EUR_TO_NOK' ? 'NOK_TO_EUR' : 'EUR_TO_NOK')} className="p-1 bg-slate-100 rounded hover:bg-slate-200">
                        <ArrowRightLeft size={14} className="text-slate-600" />
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                        <input 
                            type="number" 
                            value={calcAmount}
                            onChange={(e) => setCalcAmount(e.target.value)}
                            placeholder="Cantidad"
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-lg outline-none focus:border-fjord-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                            {calcMode === 'EUR_TO_NOK' ? '€' : 'kr'}
                        </span>
                    </div>
                    <div className="text-slate-400"><ArrowRight size={16}/></div>
                    <div className="flex-1 p-2 bg-fjord-50 border border-fjord-100 rounded-lg text-lg font-bold text-fjord-700 text-center">
                        {convertedValue}
                    </div>
                </div>
            </div>

            {/* Big Stats Card */}
            <div className="bg-gradient-to-r from-fjord-600 to-fjord-800 rounded-2xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={100}/></div>
                <div className="relative z-10">
                    <p className="text-fjord-200 text-xs font-bold uppercase tracking-wider mb-1">Gasto Realizado</p>
                    <div className="text-4xl font-bold mb-2">
                        {currency === 'EUR' ? '€' : ''}{stats.current.toFixed(0)}{currency === 'NOK' ? ' kr' : ''}
                    </div>
                    <div className="w-full bg-black/20 h-2 rounded-full mb-2">
                        <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (stats.current / stats.total) * 100)}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-fjord-100 font-medium">
                        <span>Total + Extras: {stats.total.toFixed(0)}</span>
                        <span>Pendiente: {stats.pending.toFixed(0)}</span>
                    </div>
                </div>
            </div>

            {/* Manual Expense Input */}
            {!isAddOpen ? (
                <button 
                    onClick={() => setIsAddOpen(true)}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold mb-6 flex items-center justify-center hover:bg-slate-50 hover:border-slate-400 transition-colors"
                >
                    <Plus size={20} className="mr-2"/> Añadir Gasto Extra
                </button>
            ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-sm text-slate-700">Nuevo Gasto</h4>
                        <button onClick={() => setIsAddOpen(false)}><X size={18} className="text-slate-400"/></button>
                        </div>
                        <div className="space-y-3">
                        <input 
                            type="text" placeholder="Concepto (ej: Imán)" 
                            className="w-full p-2 rounded border border-slate-300 text-sm"
                            value={newExpName} onChange={e => setNewExpName(e.target.value)}
                        />
                        <div className="flex space-x-2">
                            <input 
                                type="number" placeholder="Precio" 
                                className="flex-1 p-2 rounded border border-slate-300 text-sm"
                                value={newExpCost} onChange={e => setNewExpCost(e.target.value)}
                            />
                            <div className="flex items-center bg-white px-3 border border-slate-300 rounded text-sm font-bold text-slate-500">
                                {currency}
                            </div>
                        </div>
                        <button 
                            onClick={addCustomExpense}
                            className="w-full bg-fjord-600 text-white py-2 rounded-lg font-bold text-sm shadow hover:bg-fjord-700"
                        >
                            Guardar
                        </button>
                        </div>
                </div>
            )}

            {/* Interactive List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                {/* Custom Expenses List */}
                {customExpenses.map((item) => (
                        <div 
                        key={item.id} 
                        className="flex items-center justify-between p-4 border-b border-slate-50 bg-yellow-50/50"
                    >
                        <div className="flex items-center">
                            <div className="w-5 h-5 rounded border border-emerald-500 bg-emerald-500 mr-3 flex items-center justify-center">
                                <CheckCircle2 size={14} className="text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-800">{item.title}</p>
                                <p className="text-xs text-slate-400 italic">Extra Manual</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="font-bold font-mono text-fjord-600 mr-3">
                                {currency === 'EUR' ? `€${item.priceEUR.toFixed(0)}` : `${item.priceNOK.toFixed(0)} kr`}
                            </div>
                            <button onClick={() => removeCustomExpense(item.id)} className="text-red-400 hover:text-red-600">
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    </div>
                ))}

                {/* Planned Itinerary List */}
                {itinerary.filter(i => i.priceEUR > 0).map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => togglePaid(item.id)}
                        className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                        <div className="flex items-center">
                            <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors ${paidItems.includes(item.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                                {paidItems.includes(item.id) && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                            <div>
                                <p className={`font-medium ${paidItems.includes(item.id) ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.title}</p>
                                <p className="text-xs text-slate-400 capitalize">{item.type}</p>
                            </div>
                        </div>
                        <div className={`font-bold font-mono ${paidItems.includes(item.id) ? 'text-slate-400' : 'text-fjord-600'}`}>
                            {currency === 'EUR' ? `€${item.priceEUR}` : `${item.priceNOK} kr`}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Budget;