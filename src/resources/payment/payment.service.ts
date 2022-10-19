import Payment from '@/resources/payment/payment.interface';
import PaymentModel from '@/resources/payment/payment.model';
import ProductModel from '@/resources/product/product.model';
class PaymentService {
    private payment = PaymentModel;
    private product = ProductModel;

    private async sold(
        id: string,
        quantity: number,
        stock: number,
        oldSold: number
    ) {
        await this.product.findByIdAndUpdate(
            { _id: id },
            { sold: quantity + oldSold }
        );
        await this.product.findByIdAndUpdate(
            { _id: id },
            { stock: stock - quantity }
        );
    }
    public async getPayments(): Promise<Payment[]> {
        try {
            const payments = await this.payment.find();
            return payments;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async create(
        user_id: string,
        name: string,
        email: string,
        cart: any,
        address: string
    ): Promise<Payment> {
        try {
            const payment = await this.payment.create({
                user_id,
                name,
                email,
                cart,
                address,
            });
            cart.filter((item: any) => {
                return this.sold(
                    item._id,
                    item.quantity,
                    item.stock,
                    item.sold
                );
            });
            return payment;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default PaymentService;
