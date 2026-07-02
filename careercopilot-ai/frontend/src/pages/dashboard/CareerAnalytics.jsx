import React from 'react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import { ANALYTICS_DATA } from '../../constants/dashboardData';

function CareerAnalytics() {
  const { monthlyApplications, stagesBreakdown, skillLevels } = ANALYTICS_DATA;

  // Render mock SVG line chart for applications by month
  const renderLineChart = () => {
    const points = monthlyApplications
      .map((d, index) => {
        const x = 50 + index * 90;
        const y = 200 - d.count * 8; // scale count
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg viewBox="0 0 600 240" style={{ width: '100%', height: 'auto', background: 'transparent' }}>
        {/* Grid lines */}
        <line x1="50" y1="200" x2="500" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="50" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4" />
        <line x1="50" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4" />
        
        {/* Draw main line path */}
        <polyline
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="3"
          points={points}
        />

        {/* Glow behind line */}
        <polyline
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeOpacity="0.15"
          points={points}
          style={{ filter: 'blur(3px)' }}
        />

        {/* Axis Labels */}
        {monthlyApplications.map((d, idx) => {
          const x = 50 + idx * 90;
          return (
            <g key={idx}>
              <circle cx={x} cy={200 - d.count * 8} r="5" fill="var(--bg-primary)" stroke="var(--color-accent)" strokeWidth="2" />
              <text x={x} y={225} fill="var(--text-secondary)" fontSize="11" textAnchor="middle" fontFamily="sans-serif">
                {d.month}
              </text>
              <text x={x} y={200 - d.count * 8 - 12} fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                {d.count}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Render mock SVG bar chart for response rates by month
  const renderBarChart = () => {
    // mock response rates percentages
    const responseRates = [35, 40, 38, 45, 52, 50];
    return (
      <svg viewBox="0 0 600 240" style={{ width: '100%', height: 'auto' }}>
        {/* Grid lines */}
        <line x1="50" y1="200" x2="500" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="50" y1="110" x2="500" y2="110" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4" />
        
        {responseRates.map((rate, idx) => {
          const x = 70 + idx * 75;
          const height = rate * 1.5;
          const y = 200 - height;
          return (
            <g key={idx}>
              {/* background bar shadow */}
              <rect x={x} y="40" width="36" height="160" fill="rgba(255,255,255,0.01)" rx="3" />
              {/* active progress bar */}
              <rect 
                x={x} 
                y={y} 
                width="36" 
                height={height} 
                fill={idx % 2 === 0 ? 'var(--color-accent-purple)' : 'var(--color-accent)'} 
                rx="4"
              />
              <text x={x + 18} y={y - 8} fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                {rate}%
              </text>
              <text x={x + 18} y="222" fill="var(--text-secondary)" fontSize="11" textAnchor="middle" fontFamily="sans-serif">
                {monthlyApplications[idx]?.month || ''}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Career Analytics & Insights" 
        description="Review your pipeline metrics, conversion funnel, and skills telemetry breakdown."
      />

      {/* Top statistics summary */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <StatCard title="Funnel Response Rate" value="50.0%" icon="📈" change="+4.2% MoM" isPositive={true} />
        <StatCard title="Interview Conversion" value="25.0%" icon="🗓️" change="+1.8% MoM" isPositive={true} />
        <StatCard title="Average ATS Match" value="88%" icon="📄" change="+5.0% post-keywords" isPositive={true} />
        <StatCard title="Active Leads Volume" value="12 open" icon="⚡" change="Stripe onsite pending" isPositive={true} />
      </div>

      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {/* Chart 1 */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Job Applications Velocity (2026)
          </h3>
          <div style={{ padding: '1rem 0' }}>
            {renderLineChart()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '0.5rem' }}>
            Monthly submitted resume applications (total: 24 active campaigns)
          </span>
        </div>

        {/* Chart 2 */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Outbound Response Funnel (%)
          </h3>
          <div style={{ padding: '1rem 0' }}>
            {renderBarChart()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textAlign: 'center', marginTop: '0.5rem' }}>
            Ratio of recruiters response chats divided by sent cold mail outbounds
          </span>
        </div>
      </div>

      <div className="grid-2">
        {/* Funnel circular radial components */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Funnel Conversion Metrics
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '1.5rem 0' }}>
            <div style={{ textAlign: 'center' }}>
              <svg width="100" height="100" viewBox="0 0 36 36">
                <path
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="3"
                  strokeDasharray="50, 100"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">50%</text>
              </svg>
              <h4 style={{ fontSize: '0.85rem', marginTop: '10px', color: 'var(--text-secondary)' }}>Outbound Rate</h4>
            </div>

            <div style={{ textAlign: 'center' }}>
              <svg width="100" height="100" viewBox="0 0 36 36">
                <path
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  fill="none"
                  stroke="var(--color-accent-purple)"
                  strokeWidth="3"
                  strokeDasharray="25, 100"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">25%</text>
              </svg>
              <h4 style={{ fontSize: '0.85rem', marginTop: '10px', color: 'var(--text-secondary)' }}>Interview Rate</h4>
            </div>

            <div style={{ textAlign: 'center' }}>
              <svg width="100" height="100" viewBox="0 0 36 36">
                <path
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  fill="none"
                  stroke="var(--color-success)"
                  strokeWidth="3"
                  strokeDasharray="12, 100"
                  strokeLinecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">12%</text>
              </svg>
              <h4 style={{ fontSize: '0.85rem', marginTop: '10px', color: 'var(--text-secondary)' }}>Offer Conversion</h4>
            </div>
          </div>
        </div>

        {/* Skill levels progress */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Job Keyword Alignment Metrics
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {skillLevels.map((skill, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{skill.name}</span>
                  <span style={{ color: 'var(--color-accent)' }}>{skill.level}% match</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${skill.level}%`, 
                      height: '100%', 
                      backgroundColor: idx % 2 === 0 ? 'var(--color-accent)' : 'var(--color-accent-purple)',
                      borderRadius: '3px'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareerAnalytics;
