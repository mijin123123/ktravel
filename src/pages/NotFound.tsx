import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <p className="text-2xl font-bold text-gray-900 mb-6">페이지를 찾을 수 없습니다</p>
        <p className="text-gray-600 mb-8">
          죄송합니다. 요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Link to="/" className="btn btn-primary px-5 py-2 text-base w-full sm:w-auto">
            홈으로 이동
          </Link>
          <Link to="/contact" className="btn btn-secondary px-5 py-2 text-base w-full sm:w-auto">
            문의하기
          </Link>
        </div>
        
        <div className="mt-12">
          <p className="text-gray-500 text-sm">
            추천 여행지
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <Link to="/packages?region=europe" className="text-sm text-primary-600 hover:text-primary-800">
              유럽여행
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/packages?region=asia" className="text-sm text-primary-600 hover:text-primary-800">
              아시아여행
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/packages?region=america" className="text-sm text-primary-600 hover:text-primary-800">
              미주여행
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/packages?type=honeymoon" className="text-sm text-primary-600 hover:text-primary-800">
              허니문
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
