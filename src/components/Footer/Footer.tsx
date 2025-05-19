import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="px-10 py-10 md:py-20 lg:py-20">
      <div className="col">
        <Image className="logo" src="/img/logo.png" alt=""  width={100} height={100}/>
        <h4>Contact</h4>
        <p><strong>Address:</strong> Patuakhanli, Barisal,Bangladesh</p>
        <p><strong>Phone</strong> +880 01601588531 /(+880) 01923588531</p>
        <p><strong>Hours</strong>10:00 - 18:00, Mon - Sat</p>
        <div className="follow">
          <button>Follow us</button>
          <div className="icon">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-pinterest-p"></i>
            <i className="fab fa-youtube"></i>
          </div>
        </div>
      </div>

      <div className="col">
        <h4>About</h4>
        <Link href="#">About Us</Link>
        <Link href="#">Delivery Information</Link>
        <Link href="#">Privacy Policy</Link>
        <Link href="#">Terms & Condition</Link>
        <Link href="#">Contact Us</Link>
      </div>

      <div className="col">
        <h4>My Account</h4>
        <Link href="#">Sign In</Link>
        <Link href="#">View Cart</Link>
        <Link href="#">My Wishlist</Link>
        <Link href="#">Track My Order</Link>
        <Link href="#">Help</Link>
      </div>

      <div className="col install">
        <h4>Install App</h4>
        <p>From App Store or Google Play</p>
        <div className="row">
          <Image src="/img/pay/app.jpg" alt=""  width={200} height={150}/>
          <Image src="/img/pay/play.jpg" alt=""  width={200} height={150}/>
        </div>
        <p>Secured Payment Gateways</p>
        <Image src="/img/pay/pay.png" alt="" width={200} height={150} />
      </div>

      <div className="copyright">
        <p> Copyrights - Shehzor Memon. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer