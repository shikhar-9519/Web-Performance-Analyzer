import { Box, Card, CardContent, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { metricInfo } from "../constant";
import { HelpCircle } from "lucide-react";

function WebVitalCard(props) {
  const { title, detail, id } = props;
  const formatHistogramData = (metric) => {
    if (!metric?.length) return [];

    return metric.map((bin) => ({
      range: bin.end ? `${bin.start}-${bin.end}` : `≥${bin.start}`,
      density: bin.density * 100,
    }));
  };
  return (
    <Card>
      <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
            {title}
          </Typography>
          <Tooltip
            title={
              <Box sx={{ p: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {metricInfo?.[id]?.description}
                </Typography>
              </Box>
            }
            arrow
          >
            <IconButton size="small" sx={{ p: 0.5 }}>
              <HelpCircle size={16} />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {detail?.percentiles?.p75} {id!== 'cumulative_layout_shift' ? 'ms' : ''}
        </Typography>
        <Box sx={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formatHistogramData(detail.histogram)}>
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="density" fill="#2196f3" name="% of pages" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

export default WebVitalCard;
