import styles from "./Logo.module.css";
import gif from "../PageIMG/Loding"
const Logo = () => {
    
    return (
        <div className={styles.container}>
            <img src={gif} alt="Loading..." className={styles.gifImage} />
        </div>
    );
}
export default Logo;