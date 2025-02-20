import { Signal, signal } from "@preact/signals-react";
export class Query {
  packages: Signal<Set<string>> = signal(new Set());

  toUrl(): string {
    const packageNames = [...this.packages.value].join(",");
    const encodedPackageNames = encodeURIComponent(packageNames);
    return `api/getNetworks/${encodedPackageNames}`;
  }
}
