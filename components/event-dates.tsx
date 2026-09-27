"use client";
import { ArrowUpRight, Clock3, MapPin, Plus } from "lucide-react";
import type { WeddingData } from "@/lib/wedding-data";
import { Reveal } from "./motion-primitives";

export default function EventDates({ data }: { data: WeddingData }) {
  return (
    <section
      id="fechas"
      className="closing-dates chapter"
      aria-labelledby="dates-title"
    >
      <Reveal className="closing-dates-heading">
        <p className="eyebrow">EL VIAJE EMPIEZA ACÁ</p>
        <h2 id="dates-title">
          Dos fechas.
          <br />
          <em>Un sí para siempre.</em>
        </h2>
      </Reveal>
      <details className="closing-details">
        <summary>
          Los detalles del gran día <Plus size={16} />
        </summary>
        <div>
          <p>{data.details.note}</p>
          {data.details.definitiveTime && (
            <p>Horario de la ceremonia: {data.details.definitiveTime}</p>
          )}
          {data.details.dressCode && (
            <p>Código de vestimenta: {data.details.dressCode}</p>
          )}
          {data.details.additionalInformation && (
            <p>{data.details.additionalInformation}</p>
          )}
        </div>
      </details>
      <div className="dates-pair">
        {data.events.map((event, i) => (
          <article
            className="date-moment"
            key={event.id}
            aria-label={`${event.venue}, ${event.dateLabel}`}
          >
            <p className="eyebrow">
              {i === 0 ? "CIVIL" : "CEREMONIA RELIGIOSA"}
            </p>
            <div className="date-numeral" aria-label={event.dateLabel}>
              <span>{event.day}</span>
              <div>
                <strong>noviembre</strong>
                <small>{event.year}</small>
              </div>
            </div>
            <h3>{event.title}</h3>
            <p className="date-time">
              <Clock3 size={18} />
              {event.timeLabel}
            </p>
            <p className="date-address">
              <MapPin size={17} />
              <span>{event.address}</span>
            </p>
            <div className="date-actions">
              <a href={event.mapUrl} target="_blank" rel="noopener noreferrer">
                Ver ubicación <ArrowUpRight size={15} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
