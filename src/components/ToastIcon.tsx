import { FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaTimesCircle } from 'react-icons/fa';

interface ToastIconProps {
    type: 'success' | 'error' | 'warning' | 'info';
}

const ToastIcon: React.FC<ToastIconProps> = (props: ToastIconProps) => {
    function getIcon() {
        switch (props.type) {
            case 'success':
                return <FaCheckCircle className='icon' />;
            case 'error':
                return <FaTimesCircle className='icon ' />;
            case 'warning':
                return <FaExclamationTriangle className='icon ' />;
            case 'info':
                return <FaLightbulb className='icon ' />;
            default:
                return <FaLightbulb className='icon ' />;
        }
        
        
    }
    return (getIcon());
}
export default ToastIcon;