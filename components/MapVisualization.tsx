import React, { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { WORLD_ATLAS_URL, COLOR_LOW, COLOR_MID, COLOR_HIGH } from '../constants';
import { GeoJSONFeature } from '../types';

interface MapVisualizationProps {
  stats: Record<string, number>;
  selectedCountry: string | null;
}

export const MapVisualization: React.FC<MapVisualizationProps> = ({ stats, selectedCountry }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  // Responsive resize
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        setDimensions({
          width: wrapperRef.current.clientWidth,
          height: wrapperRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch TopoJSON
  useEffect(() => {
    d3.json(WORLD_ATLAS_URL).then((data) => {
      setWorldData(data);
    });
  }, []);

  // Prepare Data & Color Scale
  const { features, colorScale } = useMemo(() => {
    if (!worldData) return { features: [], colorScale: null };

    // @ts-ignore
    const features = topojson.feature(worldData, worldData.objects.countries).features as GeoJSONFeature[];

    // Calculate max value for scale domain
    const maxVal = Math.max(...(Object.values(stats) as number[]), 100);

    const colorScale = d3.scaleLinear<string>()
      .domain([0, maxVal * 0.4, maxVal]) // Non-linear distribution to make colors pop
      .range([COLOR_LOW, COLOR_MID, COLOR_HIGH])
      .interpolate(d3.interpolateRgb);

    return { features, colorScale };
  }, [worldData, stats]);

  // D3 Rendering
  useEffect(() => {
    if (!svgRef.current || features.length === 0 || !colorScale) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const { width, height } = dimensions;

    // Projection
    const projection = d3.geoMercator()
      .fitSize([width, height], { type: "FeatureCollection", features: features } as any)
      .translate([width / 2, height / 1.6]); // Slight offset to center visually

    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append("g");

    // Render Countries
    g.selectAll("path")
      .data(features)
      .enter()
      .append("path")
      .attr("d", (d: any) => pathGenerator(d))
      .attr("fill", (d: GeoJSONFeature) => {
        const countryName = d.properties.name;
        // Basic mapping attempt - in real app, match by ID
        // We do a loose name match for this demo
        let count = 0;
        // Try to find the stat key that partially matches the geo name
        const key = Object.keys(stats).find(k => k.includes(countryName) || countryName.includes(k));
        if (key) count = stats[key];

        return count > 0 ? colorScale(count) : "#1a1a2e"; // Default dark color if no votes
      })
      .attr("stroke", "#0f0f2d")
      .attr("stroke-width", 0.5)
      .attr("class", "transition-all duration-300 ease-in-out cursor-pointer hover:opacity-80")
      .on("mouseenter", (event, d: GeoJSONFeature) => {
        const countryName = d.properties.name;
        let count = 0;
        const key = Object.keys(stats).find(k => k.includes(countryName) || countryName.includes(k));
        if (key) count = stats[key];
        
        setHoveredName(countryName);
        setHoveredValue(count);
        
        d3.select(event.currentTarget).attr("stroke", "#fff").attr("stroke-width", 1.5);
      })
      .on("mouseleave", (event) => {
        setHoveredName(null);
        setHoveredValue(null);
        d3.select(event.currentTarget).attr("stroke", "#0f0f2d").attr("stroke-width", 0.5);
      });

    // Highlight Selected Country (Pulse Effect)
    if (selectedCountry) {
       // Find the feature
       const selectedFeature = features.find(f => 
         f.properties.name.includes(selectedCountry) || selectedCountry.includes(f.properties.name)
       );
       
       if (selectedFeature) {
         // Add a marker or ring
         // We can't easily animate SVG path stroke in React without more D3 logic, 
         // so let's just use the D3 transition here
         const centroid = pathGenerator.centroid(selectedFeature as any);
         if (centroid) {
            g.append("circle")
             .attr("cx", centroid[0])
             .attr("cy", centroid[1])
             .attr("r", 5)
             .attr("fill", "white")
             .attr("opacity", 0)
             .transition()
             .duration(1000)
             .ease(d3.easeElastic)
             .attr("opacity", 1)
             .attr("r", 8);

            g.append("circle")
             .attr("cx", centroid[0])
             .attr("cy", centroid[1])
             .attr("r", 8)
             .attr("fill", "none")
             .attr("stroke", "#ff007f")
             .attr("stroke-width", 2)
             .transition()
             .duration(2000)
             .attr("r", 30)
             .attr("opacity", 0)
             .on("end", function repeat() {
               // @ts-ignore
               d3.select(this)
                 .attr("r", 8)
                 .attr("opacity", 1)
                 .transition()
                 .duration(2000)
                 .attr("r", 30)
                 .attr("opacity", 0)
                 .on("end", repeat);
             });
         }
       }
    }

    // Zoom behavior (Optional, but nice for UX)
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    // @ts-ignore
    svg.call(zoom);

  }, [features, colorScale, dimensions, stats, selectedCountry]);

  return (
    <div ref={wrapperRef} className="relative w-full h-full overflow-hidden rounded-xl border border-blue-900/30 bg-[#050510]/50 backdrop-blur-sm shadow-2xl">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full h-full" />
      
      {/* Hover Tooltip */}
      {hoveredName && (
        <div className="absolute bottom-6 right-6 p-4 bg-black/80 backdrop-blur border-l-4 border-rose-500 rounded text-right pointer-events-none">
          <h3 className="text-xl font-ado text-white font-bold">{hoveredName}</h3>
          <p className="text-blue-300 font-mono">{hoveredValue} Votes</p>
        </div>
      )}
    </div>
  );
};