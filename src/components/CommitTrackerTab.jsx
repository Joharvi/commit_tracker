import { IconSort } from './Icons'
import contractLineOutcomeIcon from '../assets/contract-line-outcome.svg'
import {
  POPULATED_COMMIT, CONTRACTS, ORDERS,
  formatCurrency, formatDate, buildDrawdownRows,
} from '../data/commitData'

function TrackerTable({ title, columns, rows }) {
  return (
    <div className="tracker-table-section">
      <h3>{title}</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="tracker-table" aria-label={title}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>
                  <span className="th-inner">{col.label} <IconSort /></span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', color: '#706e6b', padding: '20px' }}>
                  No items to display
                </td>
              </tr>
            ) : rows.map((row, i) => (
              <tr key={i}>
                {columns.map(col => (
                  <td key={col.key}>{col.render ? col.render(row) : (row[col.key] ?? '—')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function CommitTrackerTab({ commit = POPULATED_COMMIT, populated = true }) {
  const {
    status, commitType, termMonths, participatingAccountIds,
    totalCommitValue, commitConsumed, rolloverTotal, startDate,
  } = commit

  const commitmentYears = populated ? Math.ceil(termMonths / 12) : 0
  const participatingCount = populated ? (participatingAccountIds?.length ?? 0) : 0
  const remainingCommit = populated ? (totalCommitValue - commitConsumed) : 0
  const annualCommitValue = populated ? totalCommitValue / commitmentYears : 0
  const drawdownRows = populated ? buildDrawdownRows(startDate, termMonths, commitConsumed) : []
  const contracts = populated ? CONTRACTS : []
  const orders = populated ? ORDERS : []

  return (
    <div>
      {/* Commit overview */}
      <div className="tracker-section">
        <div className="tracker-section-header">
          <img src={contractLineOutcomeIcon} alt="" className="commit-overview-icon" aria-hidden="true" />
          <h2>Commit overview</h2>
        </div>
        <div className="tracker-overview-rows">
          {/* Row 1: status, type, years, accounts */}
          <div className="tracker-overview-row1">
            <div className="tracker-field">
              <span className="tf-label">Commit status</span>
              <span className="tf-value">
                <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
              </span>
            </div>
            <div className="tracker-field">
              <span className="tf-label">Commit type</span>
              <span className="tf-value">{commitType}</span>
            </div>
            <div className="tracker-field">
              <span className="tf-label">Commitment years</span>
              <span className="tf-value">{populated ? commitmentYears : '—'}</span>
            </div>
            <div className="tracker-field">
              <span className="tf-label">Participating accounts</span>
              <span className="tf-value">{populated ? participatingCount : '—'}</span>
            </div>
          </div>

          {/* Row 2: financial KPIs */}
          <div className="tracker-overview-row2">
            <div className="tracker-kpi">
              <span className="tk-label">Total commit value</span>
              <span className="tk-value">{populated ? formatCurrency(totalCommitValue) : '—'}</span>
            </div>
            <div className="tracker-kpi">
              <span className="tk-label">Commit consumed</span>
              <span className="tk-value">{populated ? formatCurrency(commitConsumed) : '—'}</span>
            </div>
            <div className="tracker-kpi">
              <span className="tk-label">Remaining commit</span>
              <span className="tk-value">{populated ? formatCurrency(remainingCommit) : '—'}</span>
            </div>
            <div className="tracker-kpi">
              <span className="tk-label">Annual commit value</span>
              <span className="tk-value">{populated ? formatCurrency(annualCommitValue) : '—'}</span>
            </div>
            <div className="tracker-kpi">
              <span className="tk-label">Max discount variance</span>
              <span className="tk-value">{populated ? '0.00%' : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Annual commit drawdown */}
      <TrackerTable
        title="Annual commit drawdown"
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'startDate', label: 'Start date' },
          { key: 'endDate', label: 'End date' },
          { key: 'annualCommit', label: 'Annual commit', render: r => formatCurrency(r.annualCommit) },
          { key: 'drawdown', label: 'Drawdown', render: r => formatCurrency(r.drawdown) },
          { key: 'remaining', label: 'Remaining', render: r => formatCurrency(r.remaining) },
          { key: 'pctUsed', label: '% used' },
          { key: 'orders', label: 'Orders' },
        ]}
        rows={drawdownRows}
      />

      {/* Contracts */}
      <TrackerTable
        title="Contracts"
        columns={[
          { key: 'number', label: 'Contract number', render: r => <a href="#" onClick={e=>e.preventDefault()}>{r.number}</a> },
          { key: 'account', label: 'Account name' },
          { key: 'status', label: 'Status' },
          { key: 'startDate', label: 'Start date' },
          { key: 'endDate', label: 'End date', render: r => r.endDate || '—' },
          { key: 'term', label: 'Contract term', render: r => r.term ? `${r.term} mo` : '—' },
          { key: 'totalValue', label: 'Total value', render: r => formatCurrency(r.totalValue) },
        ]}
        rows={contracts}
      />

      {/* Orders */}
      <TrackerTable
        title="Orders"
        columns={[
          { key: 'number', label: 'Order number', render: r => <a href="#" onClick={e=>e.preventDefault()}>{r.number}</a> },
          { key: 'account', label: 'Account name' },
          { key: 'status', label: 'Status' },
          { key: 'orderDate', label: 'Order date' },
          { key: 'totalAmount', label: 'Total amount', render: r => formatCurrency(r.totalAmount) },
          { key: 'type', label: 'Type' },
        ]}
        rows={orders}
      />
    </div>
  )
}
