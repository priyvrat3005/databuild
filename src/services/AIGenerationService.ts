import { BuildingSpec } from '../types';
import { BuildingGeneratorService } from './BuildingGeneratorService';

interface ParsedDescription {
  numberOfFloors: number;
  roomsPerFloor: number;
  width: number;
  depth: number;
  floorHeight: number;
  roofType: 'flat' | 'gable' | 'hip' | 'shed' | 'mansard';
  hasBalconies: boolean;
  style: string;
  features: string[];
}

export class AIGenerationService {
  static parseDescription(description: string): ParsedDescription {
    const lower = description.toLowerCase();
    const result: ParsedDescription = {
      numberOfFloors: 2,
      roomsPerFloor: 3,
      width: 12,
      depth: 10,
      floorHeight: 3,
      roofType: 'gable',
      hasBalconies: false,
      style: 'modern',
      features: [],
    };

    // Parse number of floors
    const floorMatch = lower.match(/(\d+)\s*(?:floor|story|storey|level)/);
    if (floorMatch) {
      result.numberOfFloors = Math.min(10, Math.max(1, parseInt(floorMatch[1])));
    } else if (lower.includes('single') || lower.includes('one floor') || lower.includes('bungalow')) {
      result.numberOfFloors = 1;
    } else if (lower.includes('two') || lower.includes('2')) {
      result.numberOfFloors = 2;
    } else if (lower.includes('three') || lower.includes('3')) {
      result.numberOfFloors = 3;
    } else if (lower.includes('skyscraper') || lower.includes('tower') || lower.includes('high-rise')) {
      result.numberOfFloors = 8;
      result.floorHeight = 3.5;
    }

    // Parse rooms
    const roomMatch = lower.match(/(\d+)\s*(?:room|bedroom|office)/);
    if (roomMatch) {
      result.roomsPerFloor = Math.min(8, Math.max(1, parseInt(roomMatch[1])));
    } else if (lower.includes('many rooms') || lower.includes('large')) {
      result.roomsPerFloor = 5;
    } else if (lower.includes('few rooms') || lower.includes('small') || lower.includes('studio')) {
      result.roomsPerFloor = 1;
    }

    // Parse dimensions
    const sizeMatch = lower.match(/(\d+)\s*(?:meter|m)\s*(?:wide|width|x)/);
    if (sizeMatch) {
      result.width = Math.min(50, Math.max(5, parseInt(sizeMatch[1])));
    }
    const depthMatch = lower.match(/(\d+)\s*(?:meter|m)\s*(?:deep|depth|long)/);
    if (depthMatch) {
      result.depth = Math.min(50, Math.max(5, parseInt(depthMatch[1])));
    }

    if (lower.includes('large') || lower.includes('big') || lower.includes('mansion')) {
      result.width = Math.max(result.width, 20);
      result.depth = Math.max(result.depth, 15);
    } else if (lower.includes('small') || lower.includes('tiny') || lower.includes('cottage')) {
      result.width = Math.min(result.width, 8);
      result.depth = Math.min(result.depth, 8);
    }

    // Parse roof type
    if (lower.includes('flat roof') || lower.includes('flat-roofed')) {
      result.roofType = 'flat';
    } else if (lower.includes('hip roof') || lower.includes('hip-roofed')) {
      result.roofType = 'hip';
    } else if (lower.includes('shed roof')) {
      result.roofType = 'shed';
    } else if (lower.includes('mansard')) {
      result.roofType = 'mansard';
    } else if (lower.includes('gable') || lower.includes('pitched')) {
      result.roofType = 'gable';
    }

    // Parse balconies
    if (lower.includes('balcony') || lower.includes('balconies') || lower.includes('terrace')) {
      result.hasBalconies = true;
    }

    // Parse style
    if (lower.includes('modern') || lower.includes('contemporary')) {
      result.style = 'modern';
    } else if (lower.includes('classical') || lower.includes('traditional') || lower.includes('colonial')) {
      result.style = 'classical';
    } else if (lower.includes('industrial')) {
      result.style = 'industrial';
    } else if (lower.includes('minimalist') || lower.includes('minimal')) {
      result.style = 'minimalist';
    }

    // Parse features
    if (lower.includes('glass') || lower.includes('large window')) {
      result.features.push('large-windows');
    }
    if (lower.includes('garage')) {
      result.features.push('garage');
    }
    if (lower.includes('garden') || lower.includes('green')) {
      result.features.push('garden');
    }
    if (lower.includes('pool') || lower.includes('swimming')) {
      result.features.push('pool');
    }

    return result;
  }

  static generateFromDescription(description: string): BuildingSpec {
    const parsed = this.parseDescription(description);

    return BuildingGeneratorService.generateBuilding({
      name: `AI Generated: ${description.substring(0, 40)}...`,
      description: description,
      numberOfFloors: parsed.numberOfFloors,
      floorHeight: parsed.floorHeight,
      width: parsed.width,
      depth: parsed.depth,
      wallThickness: 0.3,
      roomsPerFloor: parsed.roomsPerFloor,
      roofType: parsed.roofType,
      hasBalconies: parsed.hasBalconies,
    });
  }

  static getExamplePrompts(): string[] {
    return [
      'Generate a 3-floor modern house with 4 rooms per floor, large glass windows and a flat roof.',
      'Create a small cottage with 1 floor, 2 rooms, and a gable roof.',
      'Build a 5-story office building with many rooms and balconies.',
      'Design a large mansion with 3 floors, 6 rooms per floor, hip roof, and balconies.',
      'Generate a minimalist studio apartment with 1 floor and 1 room.',
      'Create a 10-story skyscraper tower with flat roof.',
    ];
  }
}
