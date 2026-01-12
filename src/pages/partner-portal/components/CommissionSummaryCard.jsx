import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CommissionSummaryCard = ({ summary }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-sm">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-foreground">Commission Summary</h3>
        <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
          Export
        </Button>
      </div>
      <div className="space-y-4 md:space-y-6">
        <div className="p-4 md:p-5 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="caption text-muted-foreground">Total Earned (YTD)</span>
            <Icon name="TrendingUp" size={20} className="text-success" />
          </div>
          <p className="text-2xl md:text-3xl font-semibold text-foreground data-text mb-1">
            ${summary?.totalEarned?.toLocaleString()}
          </p>
          <p className="caption text-success">
            +{summary?.growth}% from last year
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={18} className="text-warning" />
              <span className="caption text-muted-foreground">Pending</span>
            </div>
            <p className="text-xl md:text-2xl font-semibold text-foreground data-text">
              ${summary?.pending?.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="CheckCircle2" size={18} className="text-success" />
              <span className="caption text-muted-foreground">Paid</span>
            </div>
            <p className="text-xl md:text-2xl font-semibold text-foreground data-text">
              ${summary?.paid?.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">Recent Transactions</h4>
          <div className="space-y-3">
            {summary?.recentTransactions?.map((transaction) => (
              <div key={transaction?.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: transaction?.type === 'credit' ?'var(--color-success)15' :'var(--color-error)15' 
                    }}
                  >
                    <Icon 
                      name={transaction?.type === 'credit' ? 'ArrowDownLeft' : 'ArrowUpRight'} 
                      size={16} 
                      color={transaction?.type === 'credit' ? 'var(--color-success)' : 'var(--color-error)'}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{transaction?.description}</p>
                    <p className="caption text-muted-foreground">{transaction?.date}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold data-text ${
                  transaction?.type === 'credit' ? 'text-success' : 'text-error'
                }`}>
                  {transaction?.type === 'credit' ? '+' : '-'}${transaction?.amount?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" fullWidth iconName="FileText" iconPosition="left">
          View Full Statement
        </Button>
      </div>
    </div>
  );
};

export default CommissionSummaryCard;