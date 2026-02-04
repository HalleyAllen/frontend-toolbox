import { useState } from 'react'
import './App.css'

function App() {
  const [activeTool, setActiveTool] = useState('time-calculator')
  const [timeRows, setTimeRows] = useState([{ days: '', hours: '', minutes: '', seconds: '', multiplier: '', operation: 'add' }])
  const [result, setResult] = useState('')

  const addRow = () => {
    setTimeRows([...timeRows, { days: '', hours: '', minutes: '', seconds: '', multiplier: '', operation: 'add' }])
  }

  const removeRow = (index) => {
    if (timeRows.length > 1) {
      setTimeRows(timeRows.filter((_, i) => i !== index))
    }
  }

  const clearAll = () => {
    setTimeRows([{ days: '', hours: '', minutes: '', seconds: '', multiplier: '' }])
    setResult('')
  }

  const updateRow = (index, field, value) => {
    const newRows = [...timeRows]
    newRows[index][field] = value
    setTimeRows(newRows)
  }

  const calculateTime = () => {
    if (timeRows.length === 0) {
      setResult('请添加时间数据')
      return
    }

    // 计算第一行作为初始值
    const firstRow = timeRows[0]
    const multiplier1 = parseInt(firstRow.multiplier) || 1
    let totalDays = (parseInt(firstRow.days) || 0) * multiplier1
    let totalHours = (parseInt(firstRow.hours) || 0) * multiplier1
    let totalMinutes = (parseInt(firstRow.minutes) || 0) * multiplier1
    let totalSeconds = (parseInt(firstRow.seconds) || 0) * multiplier1

    // 转换为总秒数
    let totalSeconds1 = totalDays * 24 * 60 * 60 + totalHours * 60 * 60 + totalMinutes * 60 + totalSeconds

    // 处理其余行
    for (let i = 1; i < timeRows.length; i++) {
      const row = timeRows[i]
      const multiplier = parseInt(row.multiplier) || 1
      const days = (parseInt(row.days) || 0) * multiplier
      const hours = (parseInt(row.hours) || 0) * multiplier
      const minutes = (parseInt(row.minutes) || 0) * multiplier
      const seconds = (parseInt(row.seconds) || 0) * multiplier
      const rowSeconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds

      if (row.operation === 'add') {
        totalSeconds1 += rowSeconds
      } else if (row.operation === 'subtract') {
        totalSeconds1 -= rowSeconds
      }
    }

    // 处理负数情况
    const isNegative = totalSeconds1 < 0
    totalSeconds1 = Math.abs(totalSeconds1)

    // 转换回天时分秒
    const days = Math.floor(totalSeconds1 / (24 * 60 * 60))
    totalSeconds1 %= 24 * 60 * 60
    const hours = Math.floor(totalSeconds1 / (60 * 60))
    totalSeconds1 %= 60 * 60
    const minutes = Math.floor(totalSeconds1 / 60)
    const seconds = totalSeconds1 % 60

    const sign = isNegative ? '-' : ''
    setResult(`${sign}${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`)
  }

  return (
    <div className="app-container">
      {/* 左侧菜单 */}
      <div className="sidebar">
        <h2>工具菜单</h2>
        <ul>
          <li
            className={activeTool === 'time-calculator' ? 'active' : ''}
            onClick={() => setActiveTool('time-calculator')}
          >
            时间加减计算器
          </li>
        </ul>
      </div>

      {/* 右侧主内容 */}
      <div className="main-content">
        {activeTool === 'time-calculator' && (
          <div className="tool-container">
            <h2>时间加减计算器</h2>



            {timeRows.map((row, index) => (
              <div key={index} className="time-row">
                {index === 0 ? (
                  <div className="form-group inline operation-buttons placeholder">
                    <label>&nbsp;</label>
                    <div className="operation-btn-group">
                      <div className="operation-btn placeholder"></div>
                      <div className="operation-btn placeholder"></div>
                    </div>
                  </div>
                ) : (
                  <div className="form-group inline operation-buttons">
                    <label>操作：</label>
                    <div className="operation-btn-group">
                      <button
                        className={`operation-btn ${row.operation === 'add' ? 'active' : ''}`}
                        onClick={() => updateRow(index, 'operation', 'add')}
                      >
                        +
                      </button>
                      <button
                        className={`operation-btn ${row.operation === 'subtract' ? 'active' : ''}`}
                        onClick={() => updateRow(index, 'operation', 'subtract')}
                      >
                        -
                      </button>
                    </div>
                  </div>
                )}
                <div className="form-group inline">
                  <label>天数：</label>
                  <input
                    type="number"
                    value={row.days}
                    onChange={(e) => updateRow(index, 'days', e.target.value)}
                  />
                </div>
                <div className="form-group inline">
                  <label>小时：</label>
                  <input
                    type="number"
                    value={row.hours}
                    onChange={(e) => updateRow(index, 'hours', e.target.value)}
                  />
                </div>
                <div className="form-group inline">
                  <label>分钟：</label>
                  <input
                    type="number"
                    value={row.minutes}
                    onChange={(e) => updateRow(index, 'minutes', e.target.value)}
                  />
                </div>
                <div className="form-group inline">
                  <label>秒：</label>
                  <input
                    type="number"
                    value={row.seconds}
                    onChange={(e) => updateRow(index, 'seconds', e.target.value)}
                  />
                </div>
                <div className="form-group inline">
                  <label>乘数：</label>
                  <input
                    type="number"
                    value={row.multiplier}
                    onChange={(e) => updateRow(index, 'multiplier', e.target.value)}
                    min="1"
                  />
                </div>
                {timeRows.length > 1 && (
                  <button
                    className="remove-btn"
                    onClick={() => removeRow(index)}
                  >
                    删除
                  </button>
                )}
              </div>
            ))}

            <div className="button-group">
              <button className="add-row-btn" onClick={addRow}>
                添加行
              </button>
              <button className="clear-btn" onClick={clearAll}>
                清空
              </button>
            </div>

            <button className="calculate-btn" onClick={calculateTime}>
              计算
            </button>

            {result && (
              <div className={`result ${result.startsWith('-') ? 'negative' : ''}`}>
                <h3>计算结果：</h3>
                <p>{result}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
