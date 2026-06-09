const AdminReportCards = ({ cards }) => (
  <section className="admin-report-card-grid" aria-label="Admin report summaries">
    {cards.map((card) => (
      <article className="admin-report-card" key={card.title}>
        <div>
          <h2>{card.title}</h2>
          <p>{card.description}</p>
        </div>
        <dl>
          {card.metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      </article>
    ))}
  </section>
);

export default AdminReportCards;
