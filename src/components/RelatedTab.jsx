import { IconSort } from './Icons'
import {
  PLACEHOLDER_ACCOUNTS, CONTRACTS, ORDERS, COMMIT_HISTORY,
  POPULATED_COMMIT, formatCurrency, buildDrawdownRows,
} from '../data/commitData'

function RelatedTable({ columns, rows, emptyMessage = 'No items to display' }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="related-table" aria-label="">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={col.style}>
                <span className="th-inner">{col.label} <IconSort /></span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', color: '#706e6b', padding: '20px' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : rows.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function RelatedListCard({ title, count, children }) {
  return (
    <div className="related-list-card">
      <div className="related-list-header">
        <h3>{title} ({count})</h3>
      </div>
      {children}
      <div className="related-list-footer">
        <a href="#" onClick={e => e.preventDefault()}>View all</a>
      </div>
    </div>
  )
}

export default function RelatedTab({ commit = POPULATED_COMMIT, populated = true }) {
  const participatingAccounts = populated
    ? PLACEHOLDER_ACCOUNTS.filter(a => commit.participatingAccountIds?.includes(a.id))
    : []

  const drawdownRows = populated
    ? buildDrawdownRows(commit.startDate, commit.termMonths, commit.commitConsumed)
    : []

  const contractRows = populated ? CONTRACTS : []
  const orderRows = populated ? ORDERS : []
  const historyRows = populated ? COMMIT_HISTORY : []

  const accountCommits = populated ? [
    {
      commitId: COMMIT_HISTORY[0]?.commitId,
      customer: COMMIT_HISTORY[0]?.customer,
      createdBy: COMMIT_HISTORY[0]?.createdBy,
      type: COMMIT_HISTORY[0]?.type,
      status: COMMIT_HISTORY[0]?.status,
      totalValue: COMMIT_HISTORY[0]?.totalValue,
      termMo: COMMIT_HISTORY[0]?.termMo,
      variancePct: COMMIT_HISTORY[0]?.variancePct,
      createdDate: COMMIT_HISTORY[0]?.createdDate,
    }
  ] : []

  return (
    <div>
      {/* Account commits */}
      <RelatedListCard title="Account commits" count={accountCommits.length}>
        <RelatedTable
          columns={[
            { key: 'commitId', label: 'Commit ID', render: r => <a href="#" onClick={e=>e.preventDefault()}>{r.commitId?.slice(0,12)}…</a> },
            { key: 'customer', label: 'Customer' },
            { key: 'createdBy', label: 'Created by' },
            { key: 'type', label: 'Type' },
            { key: 'status', label: 'Status' },
            { key: 'totalValue', label: 'Total value', render: r => formatCurrency(r.totalValue) },
            { key: 'termMo', label: 'Term (mo)' },
            { key: 'variancePct', label: 'Variance %', render: r => r.variancePct || '—' },
            { key: 'createdDate', label: 'Created date' },
          ]}
          rows={accountCommits}
        />
      </RelatedListCard>

      {/* Participating accounts */}
      <RelatedListCard title="Participating accounts" count={participatingAccounts.length}>
        <RelatedTable
          columns={[
            { key: 'name', label: 'Account name' },
            { key: 'globalCompany', label: 'Global company', render: r => r.globalCompany === 'none' ? 'none' : r.globalCompany },
            { key: 'accountNameLocal', label: 'Account name (local)', render: r => r.accountNameLocal === 'none' ? 'none' : r.accountNameLocal },
            { key: 'countryCode', label: 'Country code', render: r => r.countryCode === 'none' ? 'none' : r.countryCode },
            { key: 'uduns', label: 'DUNS', render: r => r.uduns === 'none' ? 'none' : r.uduns },
            {
              key: 'bill', label: 'Bill for shortfall',
              render: r => r.id === commit.billForShortfallId
                ? <span aria-label="Yes">✓</span>
                : null,
            },
          ]}
          rows={participatingAccounts}
        />
      </RelatedListCard>

      {/* Commit history */}
      <RelatedListCard title="Commit history" count={historyRows.length}>
        <RelatedTable
          columns={[
            { key: 'commitId', label: 'Commit ID', render: r => <a href="#" onClick={e=>e.preventDefault()}>{r.commitId?.slice(0,12)}…</a> },
            { key: 'customer', label: 'Customer' },
            { key: 'createdBy', label: 'Created by' },
            { key: 'type', label: 'Type' },
            { key: 'status', label: 'Status' },
            { key: 'totalValue', label: 'Total value', render: r => formatCurrency(r.totalValue) },
            { key: 'termMo', label: 'Term (mo)' },
            { key: 'variancePct', label: 'Variance %', render: r => r.variancePct || '—' },
            { key: 'createdDate', label: 'Created date' },
          ]}
          rows={historyRows}
        />
      </RelatedListCard>

      {/* Annual commit drawdown */}
      <RelatedListCard title="Annual commit drawdown" count={drawdownRows.length}>
        <RelatedTable
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
      </RelatedListCard>

      {/* Contracts */}
      <RelatedListCard title="Contracts" count={contractRows.length}>
        <RelatedTable
          columns={[
            { key: 'number', label: 'Contract number', render: r => <a href="#" onClick={e=>e.preventDefault()}>{r.number}</a> },
            { key: 'account', label: 'Account name' },
            { key: 'status', label: 'Status' },
            { key: 'startDate', label: 'Start date' },
            { key: 'endDate', label: 'End date', render: r => r.endDate || '—' },
            { key: 'term', label: 'Contract term', render: r => r.term ? String(r.term) : '—' },
            { key: 'totalValue', label: 'Total value', render: r => formatCurrency(r.totalValue) },
          ]}
          rows={contractRows}
        />
      </RelatedListCard>

      {/* Orders */}
      <RelatedListCard title="Orders" count={orderRows.length}>
        <RelatedTable
          columns={[
            { key: 'number', label: 'Order number', render: r => <a href="#" onClick={e=>e.preventDefault()}>{r.number}</a> },
            { key: 'account', label: 'Account name' },
            { key: 'status', label: 'Status' },
            { key: 'orderDate', label: 'Order date' },
            { key: 'totalAmount', label: 'Total amount', render: r => formatCurrency(r.totalAmount) },
            { key: 'type', label: 'Type' },
          ]}
          rows={orderRows}
        />
      </RelatedListCard>
    </div>
  )
}
