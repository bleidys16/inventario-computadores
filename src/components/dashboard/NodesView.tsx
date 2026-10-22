import React, { useState } from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import { 
  Server, 
  MapPin, 
  Wifi, 
  WifiOff, 
  Cpu, 
  Compass, 
  Radio 
} from 'lucide-react';

export const NodesView: React.FC = () => {
  const { nodes, computers } = useInventoryStore();
  const [filterState, setFilterState] = useState<'todos' | 'activo' | 'inactivo'>('todos');

  const filteredNodes = nodes.filter((node) => {
    if (filterState === 'activo') return node.networkStatus === 'Activo';
    if (filterState === 'inactivo') return node.networkStatus === 'Inactivo';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header and Telemetry Stats */}
      <div className="bg-[#2B124C] border border-[#522B5B] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#DFB6B2]" />
            <h2 className="font-mono text-sm uppercase font-semibold text-[#FBE4D8] tracking-wider">
              Topología y Geolocalización de Nodos TI
            </h2>
          </div>
          <p className="text-xs text-[#DFB6B2] mt-0.5">
            Monitoreo en tiempo real de sedes, salas de servidores y asignación física de hardware.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[#DFB6B2] uppercase">Red:</span>
          <button
            onClick={() => setFilterState('todos')}
            className={`px-2.5 py-1 text-xs font-mono uppercase rounded border transition-colors ${
              filterState === 'todos'
                ? 'bg-[#854F6C] text-[#FBE4D8] border-[#DFB6B2]'
                : 'bg-[#190019] text-[#DFB6B2] border-[#522B5B] hover:bg-[#522B5B]'
            }`}
          >
            Todos ({nodes.length})
          </button>
          <button
            onClick={() => setFilterState('activo')}
            className={`px-2.5 py-1 text-xs font-mono uppercase rounded border transition-colors ${
              filterState === 'activo'
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                : 'bg-[#190019] text-[#DFB6B2] border-[#522B5B] hover:bg-[#522B5B]'
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => setFilterState('inactivo')}
            className={`px-2.5 py-1 text-xs font-mono uppercase rounded border transition-colors ${
              filterState === 'inactivo'
                ? 'bg-rose-950/60 text-rose-300 border-rose-500/50'
                : 'bg-[#190019] text-[#DFB6B2] border-[#522B5B] hover:bg-[#522B5B]'
            }`}
          >
            Inactivos
          </button>
        </div>
      </div>

      {/* Grid of Nodes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNodes.map((node) => {
          const assignedComputers = computers.filter((c) => c.nodeId === node.id);
          const isOnline = node.networkStatus === 'Activo';

          return (
            <div
              key={node.id}
              className="bg-[#2B124C] border border-[#522B5B] rounded-xl p-4 flex flex-col justify-between space-y-4 hover:border-[#854F6C] transition-colors"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[#190019] border border-[#522B5B] flex items-center justify-center text-[#DFB6B2]">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#DFB6B2] uppercase block">
                        ID: {node.id}
                      </span>
                      <h3 className="font-medium text-[#FBE4D8] text-sm leading-snug">
                        {node.name}
                      </h3>
                    </div>
                  </div>

                  {/* Network Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded border uppercase ${
                      isOnline
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {isOnline ? (
                      <Wifi className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-rose-400" />
                    )}
                    <span>{node.networkStatus}</span>
                  </span>
                </div>

                {/* Sala / Sala de Servidores */}
                <div className="mt-3 pt-2.5 border-t border-[#522B5B] space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#DFB6B2]">
                    <MapPin className="w-3.5 h-3.5 text-[#DFB6B2] shrink-0" />
                    <span>{node.room}</span>
                  </div>

                  {/* Simulated GPS Coordinates */}
                  <div className="flex items-center gap-1.5 font-mono text-[#FBE4D8] bg-[#190019] px-2.5 py-1.5 rounded border border-[#522B5B]">
                    <Compass className="w-3.5 h-3.5 text-[#DFB6B2] shrink-0" />
                    <span className="text-[11px]">GPS: {node.coordinates}</span>
                  </div>
                </div>
              </div>

              {/* Technical Telemetry & Assigned Assets */}
              <div className="space-y-3 pt-3 border-t border-[#522B5B]">
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-[#190019] p-2 rounded border border-[#522B5B]">
                    <span className="text-[#DFB6B2] block text-[10px]">SUBRED IP:</span>
                    <span className="text-[#FBE4D8]">{node.subnet}</span>
                  </div>
                  <div className="bg-[#190019] p-2 rounded border border-[#522B5B]">
                    <span className="text-[#DFB6B2] block text-[10px]">PING / LATENCIA:</span>
                    <span className={isOnline ? 'text-emerald-400' : 'text-zinc-500'}>
                      {isOnline ? `${node.pingMs} ms` : 'OFFLINE'}
                    </span>
                  </div>
                </div>

                {/* Assigned Hardware Count Badge */}
                <div className="flex items-center justify-between bg-[#190019] px-3 py-2 rounded border border-[#522B5B]">
                  <div className="flex items-center gap-2 text-xs text-[#DFB6B2]">
                    <Cpu className="w-3.5 h-3.5 text-[#DFB6B2]" />
                    <span>Equipos Asignados:</span>
                  </div>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#854F6C] text-[#FBE4D8] border border-[#DFB6B2]/40">
                    {assignedComputers.length} unidades
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
