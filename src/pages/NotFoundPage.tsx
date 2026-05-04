import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div>
      <h1>404</h1>
      <p>页面未找到</p>
      <Link to="/">返回首页</Link>
    </div>
  );
}
