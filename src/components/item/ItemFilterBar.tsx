import { useAppContext } from '../../hooks/useAppContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useState, useEffect } from 'react';

export default function ItemFilterBar() {
  const { state, dispatch } = useAppContext();
  const [searchInput, setSearchInput] = useState(state.filters.search);
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    dispatch({ type: 'SET_FILTER', payload: { search: debouncedSearch } });
  }, [debouncedSearch, dispatch]);

  return (
    <div className="filter-bar">
      <input
        className="filter-search"
        type="text"
        placeholder="搜索..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <select
        className="filter-select"
        value={state.filters.type}
        onChange={(e) =>
          dispatch({
            type: 'SET_FILTER',
            payload: { type: e.target.value as typeof state.filters.type },
          })
        }
      >
        <option value="all">全部类型</option>
        <option value="task">任务</option>
        <option value="learning">学习</option>
        <option value="project">项目</option>
        <option value="event">事件</option>
      </select>
      <select
        className="filter-select"
        value={state.filters.status}
        onChange={(e) =>
          dispatch({
            type: 'SET_FILTER',
            payload: { status: e.target.value as typeof state.filters.status },
          })
        }
      >
        <option value="all">全部状态</option>
        <option value="todo">待办</option>
        <option value="in_progress">进行中</option>
        <option value="done">已完成</option>
      </select>
      <select
        className="filter-select"
        value={state.filters.priority}
        onChange={(e) =>
          dispatch({
            type: 'SET_FILTER',
            payload: { priority: e.target.value as typeof state.filters.priority },
          })
        }
      >
        <option value="all">全部优先级</option>
        <option value="urgent">紧急</option>
        <option value="high">高</option>
        <option value="medium">中</option>
        <option value="low">低</option>
      </select>
    </div>
  );
}
