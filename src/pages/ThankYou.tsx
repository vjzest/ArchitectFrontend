import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Download, MessageCircle, Star, Package } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const ThankYou = () => {
  const orderId = `AH${Date.now().toString().slice(-6)}`;
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Icon and Message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-gray mb-4">
            Thank You for Your Purchase!
          </h1>
          <p className="text-xl text-secondary-gray max-w-2xl mx-auto">
            Your order has been successfully placed and you will receive a confirmation email shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary-gray mb-6">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-primary-gray mb-4">Order Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary-gray">Order ID:</span>
                  <span className="font-semibold">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-gray">Order Date:</span>
                  <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-gray">Payment Status:</span>
                  <span className="font-semibold text-green-600">Completed</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-primary-gray mb-4">Delivery Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary-gray">Delivery Method:</span>
                  <span className="font-semibold">Digital Download</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-gray">Estimated Delivery:</span>
                  <span className="font-semibold">Instantly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-gray">Hard Copy Delivery:</span>
                  <span className="font-semibold">{estimatedDelivery}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
            <div className="w-16 h-16 gradient-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-primary-gray mb-4">Download Your Plans</h3>
            <p className="text-secondary-gray mb-6">
              Access your house plans instantly. Download high-resolution files, floor plans, and 3D views.
            </p>
            <Button className="btn-primary w-full">
              Download Files
            </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
            <div className="w-16 h-16 gradient-teal rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-primary-gray mb-4">Track Your Order</h3>
            <p className="text-secondary-gray mb-6">
              Monitor the status of your physical plan delivery and get real-time updates.
            </p>
            <Button className="btn-secondary w-full">
              Track Order
            </Button>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-soft-teal rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary-gray mb-6 text-center">What's Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="font-semibold text-primary-gray mb-2">Review Your Plans</h3>
              <p className="text-sm text-secondary-gray">
                Download and carefully review all architectural drawings and specifications.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="font-semibold text-primary-gray mb-2">Consult Our Experts</h3>
              <p className="text-sm text-secondary-gray">
                Schedule a free consultation to discuss customizations and implementation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="font-semibold text-primary-gray mb-2">Start Building</h3>
              <p className="text-sm text-secondary-gray">
                Get building permits and begin construction with confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-primary-gray mb-4">Need Help?</h3>
          <p className="text-secondary-gray mb-6">
            Our expert team is here to help you every step of the way. Contact us for any questions or support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Live Chat Support
            </Button>
            <Button variant="outline" className="flex items-center">
              <Star className="w-4 h-4 mr-2" />
              Schedule Consultation
            </Button>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="text-center">
          <Link to="/products">
            <Button className="btn-outline px-8 py-3 text-lg">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Customer Support Info */}
        <div className="mt-12 bg-white rounded-2xl shadow-soft p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-primary-gray mb-4">Customer Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <strong className="text-primary-gray">Email:</strong>
                <p className="text-secondary-gray">support@archhome.com</p>
              </div>
              <div>
                <strong className="text-primary-gray">Phone:</strong>
                <p className="text-secondary-gray">+1 (555) 123-4567</p>
              </div>
              <div>
                <strong className="text-primary-gray">Hours:</strong>
                <p className="text-secondary-gray">Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ThankYou;