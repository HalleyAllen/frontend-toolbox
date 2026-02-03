import { useState } from 'react'
import './App.css'

function App() {
  const [activeTool, setActiveTool] = useState('time-calculator')
  const [timeRows, setTimeRows] = useState([{ days: '', hours: '', minutes: '', seconds: '', multiplier: '' }])
  const [result, setResult] = useState('')

  const addRow = () => {
    setTimeRows([...timeRows, { days: '', hours: '', minutes: '', seconds: '', multiplier: '' }])
  }

  const removeRow = (index) => {
    if (timeRows.length > 1) {
      setTimeRows(timeRows.filter((_, i) => i !== index))
    }
  }

  const updateRow = (index, field, value) => {
    const newRows = [...timeRows]
    newRows[index][field] = value
    setTimeRows(newRows)
  }

  const calculateTime = () => {
    let totalDays = 0
    let totalHours = 0
    let totalMinutes = 0
    let totalSeconds = 0

    timeRows.forEach(row => {
      const multiplier = parseInt(row.multiplier) || 1
      totalDays += (parseInt(row.days) || 0) * multiplier
      totalHours += (parseInt(row.hours) || 0) * multiplier
      totalMinutes += (parseInt(row.minutes) || 0) * multiplier
      totalSeconds += (parseInt(row.seconds) || 0) * multiplier
    })

    // 转换秒为分钟
    totalMinutes += Math.floor(totalSeconds / 60)
    totalSeconds = totalSeconds % 60

    // 转换分钟为小时
    totalHours += Math.floor(totalMinutes / 60)
    totalMinutes = totalMinutes % 60

    // 转换小时为天数
    totalDays += Math.floor(totalHours / 24)
    totalHours = totalHours % 24

    setResult(`${totalDays}天 ${totalHours}小时 ${totalMinutes}分钟 ${totalSeconds}秒`)
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

            <button className="add-row-btn" onClick={addRow}>
              添加行
            </button>

            <button className="calculate-btn" onClick={calculateTime}>
              计算
            </button>

            {result && (
              <div className="result">
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
