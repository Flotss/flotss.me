import { AdminRepoRecord } from '@/types/types';
import React from 'react';
import { FaArrowDown, FaArrowUp, FaSave } from 'react-icons/fa';

interface ProjectsOrderViewProps {
  orderedRepos: AdminRepoRecord[];
  hasOrderChanges: boolean;
  savingBatchOrder: boolean;
  onMoveOrderItem: (index: number, direction: 'up' | 'down') => void;
  onMoveOrderToExtremity: (index: number, to: 'top' | 'bottom') => void;
  onSaveBatchOrder: () => void;
}

export default function ProjectsOrderView({
  orderedRepos,
  hasOrderChanges,
  savingBatchOrder,
  onMoveOrderItem,
  onMoveOrderToExtremity,
  onSaveBatchOrder,
}: ProjectsOrderViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-zinc-900/30 p-5">
        <div>
          <h2 className="text-base font-bold text-white">Project Display Ordering</h2>
          <p className="mt-0.5 text-xs text-zinc-400">
            Position #1 appears first on your portfolio. Repositories with custom order take
            precedence.
          </p>
        </div>
        <button
          onClick={onSaveBatchOrder}
          disabled={!hasOrderChanges || savingBatchOrder}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition-all ${
            hasOrderChanges
              ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400'
              : 'cursor-not-allowed border border-white/10 bg-zinc-900 text-zinc-500'
          }`}
        >
          <FaSave className={`h-3.5 w-3.5 ${savingBatchOrder ? 'animate-spin' : ''}`} />
          <span>{savingBatchOrder ? 'Saving Order...' : 'Save New Order'}</span>
        </button>
      </div>

      <div className="space-y-2">
        {orderedRepos.map((item, index) => (
          <div
            key={item.repoId}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-zinc-900/40 px-4 py-3 transition-all hover:border-white/10"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-400">
                {index + 1}
              </span>
              <div className="truncate">
                <p className="truncate text-xs font-semibold text-zinc-200">
                  {item.displayName || item.name}
                </p>
                {item.displayName && <p className="text-[10px] text-zinc-500">{item.name}</p>}
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-1.5">
              <button
                onClick={() => onMoveOrderToExtremity(index, 'top')}
                disabled={index === 0}
                className="rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                title="Jump to Top"
              >
                <span className="text-[10px] font-bold">TOP</span>
              </button>
              <button
                onClick={() => onMoveOrderItem(index, 'up')}
                disabled={index === 0}
                className="rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                title="Move Up"
              >
                <FaArrowUp className="h-3 w-3" />
              </button>
              <button
                onClick={() => onMoveOrderItem(index, 'down')}
                disabled={index === orderedRepos.length - 1}
                className="rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                title="Move Down"
              >
                <FaArrowDown className="h-3 w-3" />
              </button>
              <button
                onClick={() => onMoveOrderToExtremity(index, 'bottom')}
                disabled={index === orderedRepos.length - 1}
                className="rounded-lg border border-white/5 bg-zinc-900 p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                title="Jump to Bottom"
              >
                <span className="text-[10px] font-bold">END</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
