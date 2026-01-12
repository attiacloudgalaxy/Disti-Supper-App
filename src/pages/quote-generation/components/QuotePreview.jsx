import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuotePreview = ({ quoteData, onClose, onExport }) => {
  const currentDate = new Date()?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const validUntilDate = new Date(Date.now() + (quoteData.validityDays || 30) * 24 * 60 * 60 * 1000)?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-background/80 z-[300] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">Quote Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
            aria-label="Close preview"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          <div className="bg-surface border border-border rounded-lg p-6 md:p-8 space-y-6">
            <div className="flex items-start justify-between pb-6 border-b border-border">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Boxes" size={24} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">DistributorHub</h1>
                    <p className="caption text-muted-foreground">IT Distribution Solutions</p>
                  </div>
                </div>
                <div className="caption text-muted-foreground space-y-1 mt-4">
                  <p>123 Technology Drive</p>
                  <p>San Francisco, CA 94105</p>
                  <p>Phone: (555) 123-4567</p>
                  <p>Email: quotes@distributorhub.com</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold text-primary mb-2">QUOTE</h2>
                <div className="caption text-muted-foreground space-y-1">
                  <p>Quote #: QT-{Math.floor(Math.random() * 10000)}</p>
                  <p>Date: {currentDate}</p>
                  <p>Valid Until: {validUntilDate}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Bill To:</h3>
                <div className="caption text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">TechCorp Solutions</p>
                  <p>456 Business Avenue</p>
                  <p>New York, NY 10001</p>
                  <p>Contact: John Smith</p>
                  <p>Email: john.smith@techcorp.com</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Payment Terms:</h3>
                <div className="caption text-muted-foreground space-y-1">
                  <p>Terms: {quoteData?.paymentTerms === 'net-30' ? 'Net 30 Days' : quoteData?.paymentTerms}</p>
                  <p>Delivery: {quoteData?.deliveryMethod === 'standard' ? 'Standard Shipping (5-7 days)' : quoteData?.deliveryMethod}</p>
                  <p>Warranty: {quoteData?.includeWarranty ? 'Included' : 'Not Included'}</p>
                  <p>Support: {quoteData?.includeSupport ? 'Included (+$299)' : 'Not Included'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-foreground mb-4">Quote Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left caption font-semibold text-muted-foreground pb-3">Item</th>
                      <th className="text-center caption font-semibold text-muted-foreground pb-3">Qty</th>
                      <th className="text-right caption font-semibold text-muted-foreground pb-3">Unit Price</th>
                      <th className="text-right caption font-semibold text-muted-foreground pb-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteData?.items?.map((item, index) => (
                      <tr key={index} className="border-b border-border">
                        <td className="py-3">
                          <p className="text-sm font-medium text-foreground">{item?.name}</p>
                          <p className="caption text-muted-foreground">SKU: {item?.sku}</p>
                        </td>
                        <td className="text-center text-sm text-foreground py-3">{item?.quantity}</td>
                        <td className="text-right text-sm text-foreground py-3">
                          ${item?.partnerPrice?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="text-right text-sm font-medium text-foreground py-3">
                          ${(item?.partnerPrice * item?.quantity)?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full md:w-80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal:</span>
                  <span className="text-sm font-medium text-foreground">
                    ${quoteData?.subtotal?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {quoteData?.discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Discount ({quoteData?.discount}%):</span>
                    <span className="text-sm font-medium text-success">
                      -${quoteData?.discountAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tax (8%):</span>
                  <span className="text-sm font-medium text-foreground">
                    ${quoteData?.tax?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {quoteData?.includeSupport && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Technical Support:</span>
                    <span className="text-sm font-medium text-foreground">$299.00</span>
                  </div>
                )}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    ${quoteData?.total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Terms & Conditions</h3>
              <div className="caption text-muted-foreground space-y-2">
                <p>1. This quote is valid for {quoteData?.validityDays} days from the date of issue.</p>
                <p>2. Prices are subject to change based on manufacturer pricing updates.</p>
                <p>3. Payment terms are {quoteData?.paymentTerms === 'net-30' ? 'Net 30 Days' : quoteData?.paymentTerms} from invoice date.</p>
                <p>4. Delivery times are estimates and may vary based on product availability.</p>
                <p>5. All sales are subject to our standard terms and conditions.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 border-t border-border flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            size="lg"
            iconName="Download"
            iconPosition="left"
            onClick={() => onExport('pdf')}
          >
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="lg"
            iconName="Mail"
            iconPosition="left"
            onClick={() => onExport('email')}
          >
            Email Quote
          </Button>
          <Button
            variant="default"
            size="lg"
            iconName="Send"
            iconPosition="left"
            onClick={() => onExport('send')}
          >
            Send to Customer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuotePreview;