import { forwardRef } from "react";
import { Customer } from "../../models/Customer";
import "./PrintableLabel.css";

interface PrintableLabelProps {
  customers: Customer[];
}

export const PrintableLabel = forwardRef<HTMLDivElement, PrintableLabelProps>(
  ({ customers }, ref) => {
    function chunkArray<T>(arr: T[], size: number): T[][] {
      const result: T[][] = [];
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
      }
      return result;
    }

    return (
      <div ref={ref}>
        {chunkArray(customers, 4).map((group, groupIndex) => (
          <div key={groupIndex} className="print-section">
            {group.map((c, index) => (
              <div key={index} className="print-label">
                <div className="label-column">
                  <div className="envio-box">ENVIO</div>
                </div>
                <div className="label-content">
                  <div>
                    <strong>ATT.: </strong>
                    {c.name}
                  </div>
                  <div>
                    <strong>EMPRESA: </strong>
                    {c.company}
                  </div>
                  <div>
                    <strong>DIR.: </strong>
                    {c.direction}
                  </div>
                  <div>
                    <strong>TEL.: </strong>
                    {c.phone}
                  </div>
                  <div>
                    <strong>CIUDAD: </strong>
                    {c.city}
                  </div>
                  <div>
                    <strong>DEPART.: </strong>
                    {c.department}
                  </div>
                  <div className="footer">
                    <strong>PUBLIADHESIVOS</strong>
                    <div>BRANDZEN 2087 - TEL: 099691918 / 24028834</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
);

PrintableLabel.displayName = "PrintableLabels"; // 👈 required for forwardRef
