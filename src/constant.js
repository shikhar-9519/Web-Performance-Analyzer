export const metricInfo = {
    largest_contentful_paint: {
      description: "Largest Contentful Paint measures loading performance. Target: < 2.5s",
      threshold: 2500,
      unit: 'ms'
    },
    first_contentful_paint: {
      description: "First Contentful Paint measures when the first content appears. Target: < 1.8s",
      threshold: 1800,
      unit: 'ms'
    },
    cumulative_layout_shift: {
      description: "Cumulative Layout Shift measures visual stability. Target: < 0.1",
      threshold: 0.1,
      unit: ''
    },
    experimental_time_to_first_byte: {
      description: "Time to First Byte measures initial server response time. Target: < 0.8s",
      threshold: 800,
      unit: 'ms'
    },
    interaction_to_next_paint: {
      description: "Interaction to Next Paint measures responsiveness. Target: < 200ms",
      threshold: 200,
      unit: 'ms'
    }
  };