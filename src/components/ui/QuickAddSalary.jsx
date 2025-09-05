import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { incomeService } from '../../services/incomeService'
import Icon from '../AppIcon'

const QuickAddSalary = ({ onSalaryAdded }) => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    income_source_id: '',
    amount: '',
    currency: 'INR',
    pay_date: new Date().toISOString().split('T')[0],
    pay_frequency: 'monthly',
    pay_day: 10, // Default to 10th of every month
    is_recurring: true,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    notes: ''
  })

  const [incomeSources, setIncomeSources] = useState([])

  // Load income sources when modal opens
  const loadIncomeSources = async () => {
    try {
      const sources = await incomeService.getIncomeSources()
      setIncomeSources(sources)
      
      // If no sources exist, create a default salary source
      if (sources.length === 0) {
        const defaultSource = await incomeService.createIncomeSource({
          name: 'Salary',
          type: 'salary',
          description: 'Monthly salary income'
        })
        setIncomeSources([defaultSource])
        setFormData(prev => ({ ...prev, income_source_id: defaultSource.id }))
      } else {
        setFormData(prev => ({ ...prev, income_source_id: sources[0].id }))
      }
    } catch (err) {
      console.error('Error loading income sources:', err)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    loadIncomeSources()
  }

  const handleClose = () => {
    setIsOpen(false)
    setError(null)
    setFormData({
      income_source_id: '',
      amount: '',
      currency: 'INR',
      pay_date: new Date().toISOString().split('T')[0],
      pay_frequency: 'monthly',
      pay_day: 10,
      is_recurring: true,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      notes: ''
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid()) return

    setLoading(true)
    setError(null)

    try {
      const salaryData = {
        ...formData,
        amount: parseFloat(formData.amount),
        pay_day: formData.pay_frequency === 'monthly' ? parseInt(formData.pay_day) : null,
        end_date: formData.end_date || null
      }

      const newSalary = await incomeService.createSalary(salaryData)
      console.log('Salary added:', newSalary)
      
      if (onSalaryAdded) {
        onSalaryAdded(newSalary)
      }
      
      handleClose()
    } catch (err) {
      console.error('Error adding salary:', err)
      setError(err.message || 'Failed to add salary')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.income_source_id && 
           formData.amount && 
           formData.pay_date && 
           formData.pay_frequency && 
           formData.start_date
  }

  const getPayDayOptions = () => {
    const days = []
    for (let i = 1; i <= 31; i++) {
      days.push(i)
    }
    return days
  }

  if (!user) return null

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
      >
        <Icon name="Plus" size={16} className="mr-2" />
        Add Salary
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Add Salary</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Income Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Income Source
                </label>
                <select
                  value={formData.income_source_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, income_source_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select income source</option>
                  {incomeSources.map(source => (
                    <option key={source.id} value={source.id}>
                      {source.name} ({source.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50000"
                    required
                  />
                  <span className="absolute right-3 top-2 text-gray-500 text-sm">
                    {formData.currency}
                  </span>
                </div>
              </div>

              {/* Pay Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pay Frequency
                </label>
                <select
                  value={formData.pay_frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, pay_frequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {/* Pay Day (for monthly) */}
              {formData.pay_frequency === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pay Day (Day of Month)
                  </label>
                  <select
                    value={formData.pay_day}
                    onChange={(e) => setFormData(prev => ({ ...prev, pay_day: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {getPayDayOptions().map(day => (
                      <option key={day} value={day}>
                        {day}{day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Pay Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Pay Date
                </label>
                <input
                  type="date"
                  value={formData.pay_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, pay_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* End Date (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Additional notes about your salary..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid() || loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Salary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default QuickAddSalary
